import * as yup from 'yup';

export const billValidationSchema = yup.object().shape({
  total_amount: yup.number().integer().required(),
  organization_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
