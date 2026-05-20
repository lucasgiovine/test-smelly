const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Clean Tests', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário com dados válidos', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.idade).toBe(idade);
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('deve retornar um usuário criado ao buscar por id', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  test('deve desativar um usuário que não é administrador', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('deve gerar relatório vazio quando não há usuários', () => {
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Relatório de Usuários');
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });

  test('deve gerar relatório com nome e status dos usuários', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Relatório de Usuários');
    expect(relatorio).toContain(usuario1.nome);
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain(usuario1.status);
    expect(relatorio).toContain(usuario2.nome);
    expect(relatorio).toContain(usuario2.id);
    expect(relatorio).toContain(usuario2.status);
  });

  test('deve lançar erro ao criar usuário menor de idade', () => {
    // Act & Assert
    expect(() => {
      userService.createUser('Menor', 'menor@email.com', 17);
    }).toThrow('O usuário deve ser maior de idade.');
  });
});
