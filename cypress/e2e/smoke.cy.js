describe('Smoke Test', () => {
  it('can view the home page', () => {
    cy.visit('/')
    cy.contains('Welcome to React Tic Tac Toe')
  })
})
