describe('Player starts game', () => {
  it('should not show the board initially', () => {
    cy.visit('/')
    cy.get('[data-testid="start-new-game-button"]').should('exist')
    cy.get('[data-testid="board"]').should('not.exist')
  })

  it('should allow the player to start a new game', () => {
    cy.visit('/')

    cy.get('[data-testid="start-new-game-button"]').click()

    cy.get('[data-testid="board"]').should('exist')
    cy.get('[data-testid="cell"]').each($cell => {
      cy.wrap($cell).should('have.text', '')
    })
    cy.get('[data-testid="start-new-game-button"]').should('not.exist')
  })
})
