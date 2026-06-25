# Sistema de Gestão de TCCs

Sistema web para gerenciamento de Trabalhos de Conclusão de Curso (TCCs), desenvolvido como trabalho da disciplina de Programação Web.

O projeto é composto por:

* **Frontend:** Angular
* **Backend:** Django REST Framework (fornecido pelo professor)
* **Comunicação:** API REST

## Funcionalidades Implementadas

* Dashboard com estatísticas de TCCs
* Listagem de:

  * Alunos
  * Professores
  * Cursos
  * Departamentos
  * Unidades Acadêmicas
  * TCCs
* Busca e paginação
* Cadastro de TCCs
* Edição de TCCs
* Exclusão de registros
* Alteração de status dos TCCs

## Tecnologias Utilizadas

### Frontend

* Angular
* TypeScript
* Angular Material
* RxJS

### Backend

* Django
* Django REST Framework

## Estrutura do Projeto

```text
Projeto-TCCs-ProgWeb/
├── backend-tccs/
├── frontend-tccs/
├── docker-compose.yml
└── README.md
```

## Executando com Docker

### Pré-requisitos

* Docker
* Docker Compose

### Subindo a aplicação

Na raiz do projeto execute:

```bash
docker compose up --build
```

Após a inicialização:

| Serviço  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:4200     |
| Backend  | http://localhost:8000     |
| API DRF  | http://localhost:8000/api |

Para interromper os containers:

```bash
docker compose down
```

## Executando sem Docker

### Backend

Entre na pasta do backend:

```bash
cd backend-tccs
```

Crie e ative o ambiente virtual:

Linux:

```bash
python -m venv venv
source venv/bin/activate
```

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute as migrações:

```bash
python manage.py makemigrations core
python manage.py migrate
```

Popule o banco:

```bash
python load.py
```

Inicie o servidor:

```bash
python manage.py runserver
```

O backend ficará disponível em:

```text
http://localhost:8000
```

### Frontend

Entre na pasta do frontend:

```bash
cd frontend-tccs
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

ou

```bash
ng serve
```

A aplicação ficará disponível em:

```text
http://localhost:4200
```

## Endpoints da API

* `/api/unidades-academicas/`
* `/api/departamentos/`
* `/api/cursos/`
* `/api/alunos/`
* `/api/professores/`
* `/api/tccs/`
* `/api/tccs/estatisticas/`

## Observações

O backend foi disponibilizado pelo professor da disciplina e utilizado como base para o desenvolvimento do frontend.

O foco deste trabalho foi a implementação da interface web, integração com API REST, manipulação de formulários, paginação, filtros e visualização de dados estatísticos.
