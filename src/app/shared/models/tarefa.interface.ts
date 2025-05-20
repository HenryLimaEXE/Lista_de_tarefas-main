export interface Tarefa {
  tarefa: string;
  dataLimite: string;
  descricao: string;
  concluida: boolean;
  status: 'pendente' | 'fazendo' | 'concluido'; // novo campo
}