import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { billValidationSchema } from 'validationSchema/bills';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bill
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBillById();
    case 'PUT':
      return updateBillById();
    case 'DELETE':
      return deleteBillById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBillById() {
    const data = await prisma.bill.findFirst(convertQueryToPrismaUtil(req.query, 'bill'));
    return res.status(200).json(data);
  }

  async function updateBillById() {
    await billValidationSchema.validate(req.body);
    const data = await prisma.bill.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBillById() {
    const data = await prisma.bill.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
