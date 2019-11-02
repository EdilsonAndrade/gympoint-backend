import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class ChangeRegistrationMail {
  get key() {
    return 'ChangeRegistration';
  }

  async handle({ data }) {
    const { registration } = data;
    const endDate = parseISO(registration.endDate);

    const { name, price, plan, duration, email, studentName } = registration;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: `Alteração de Matrícula para o Plano - ${plan}`,
      template: 'updateRegister',
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

export default new ChangeRegistrationMail();
