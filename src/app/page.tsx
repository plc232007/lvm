import { TextoComMatematica } from '@/components/math/Latex';
import { CartaoTrilha } from '@/components/site/CartaoTrilha';
import { TRILHAS } from '@/lib/conteudo';

const NOTAS = [
  {
    titulo: 'Você mexe, não assiste',
    texto:
      'O triângulo é arrastável. As seis medidas recalculam enquanto você move o vértice, e cada relação aparece com os números no lugar das letras.',
  },
  {
    titulo: 'O exercício troca de número',
    texto:
      'Cada tentativa gera outro exercício a partir de uma semente. Não existe gabarito para decorar — só o procedimento, que é o que interessa.',
  },
  {
    titulo: 'Erro vira dica, não vermelho',
    texto:
      'Se você responder $m \\cdot n$ onde cabia a raiz, o LVM reconhece esse erro específico e diz o que faltou. Sem entregar o número.',
  },
];

export default function Home() {
  return (
    <div className="envolucro">
      <section style={{ maxWidth: '42rem', margin: '2rem 0 3rem' }}>
        <p className="selo selo--destaque" style={{ marginBottom: '1rem' }}>
          IFB · ensino médio e técnico
        </p>
        <h1 className="titulo-pagina" style={{ marginBottom: '0.75rem' }}>
          Geometria que responde quando você cutuca
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--tinta-media)' }}>
          O antigo mural de links virou laboratório. Aqui você arrasta o triângulo, vê as relações
          métricas continuarem valendo em qualquer posição e pratica com exercícios que mudam a cada
          tentativa. Quando travar, o Fermat está no canto da tela.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 className="titulo-secao" style={{ marginBottom: '1rem' }}>
          Trilhas
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {TRILHAS.map((trilha) => (
            <CartaoTrilha key={trilha.id} trilha={trilha} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="titulo-secao" style={{ marginBottom: '1rem' }}>
          Como este lugar funciona
        </h2>
        <div className="grade-notas">
          {NOTAS.map((nota, indice) => (
            <article key={nota.titulo} className="cartao">
              <span className="meta medida">0{indice + 1}</span>
              <h3 style={{ fontSize: '1rem' }}>{nota.titulo}</h3>
              <p style={{ color: 'var(--tinta-media)', fontSize: '0.9375rem' }}>
                <TextoComMatematica texto={nota.texto} />
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
