import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class QuestionAnsweredMail {
  get key() {
    return 'QuestionAnswered';
  }

  async handle({ data }) {
    console.log('data', data);
    const { questionAnswered } = data;
    const { answer, question, answerAt, studentName, email } = questionAnswered;

    await Mail.sendMail({
      to: `${studentName} <${email}>`,
      subject: `Resposta a sua dúvida`,
      template: 'questionAnswered',
      context: {
        student: studentName,
        question,
        answer,
        answerAt: format(parseISO(answerAt), "' ' dd 'de' MMMM, 'de' yyyy", {
          locale: pt,
        }),
        email,
      },
    });
  }
}

export default new QuestionAnsweredMail();
