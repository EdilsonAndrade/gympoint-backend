import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { registration } = data;
    const endDate = parseISO(registration.endDate);

    const { name, price, plan, duration, email, studentName } = registration;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: `Confirmação de Matrícula no Plano - ${plan}`,
      template: 'registration',
      context: {
        student: studentName,
        price: `R$ ${price.toFixed(2)}`,
        plan,
        duration,
        endDate: format(endDate, "' ' dd 'de' MMMM, 'de' yyyy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new WelcomeMail();
