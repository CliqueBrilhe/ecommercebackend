// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class PixService {
//   async criarPagamento(amount: number, customer: any) {
//     try {
//       console.log('Chave Pagarme:', process.env.PAGARME_SECRET_KEY)
//       const response = await axios.post(
//         'https://api.pagar.me/core/v5/orders',
//         {
//           items: [
//             {
//               name: 'Compra no site',
//               quantity: 1,
//               unit_price: amount,
//             },
//           ],
//           customer,
//           payments: [
//             {
//               payment_method: 'pix',
//               pix: { expires_in: 3600 },
//             },
//           ],
//         },
//         {
//           auth: {
//             username: process.env.PAGARME_SECRET_KEY!, // ⚠️ configure no .env
//             password: '',
//           },
//         },
//       );

//       const charge = response.data.charges[0];
//       const trx = charge.last_transaction;

//       return {
//         success: true,
//         transactionId: charge.id,
//         qrCode: trx.pix_qr_code_base64,
//       };
//     } catch (error: any) {
//       console.error(
//         'Erro ao criar pagamento PIX:',
//         error.response?.data || error.message,
//       );

//       return {
//         success: false,
//         error:
//           error.response?.data?.errors?.[0]?.message || 'Erro ao gerar pagamento',
//       };
//     }
//   }
// }