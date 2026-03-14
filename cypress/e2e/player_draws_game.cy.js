describe('Player draws game', () => {
  const visitAndStartGame = () => {
    cy.visit('/')
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')
    cy.get('[data-testid="cell"]').eq(0).should('have.text', '')
    cy.get('[data-testid="game-ends-message"]').should('not.exist')
  }

  beforeEach(visitAndStartGame)

  describe('when all cells are filled and no one wins', () => {
    beforeEach(() => {
      // Board (X to play field 8, result is a draw):
      //  X | O | X
      //  X | O | O
      //  O | X | _
      cy.window().invoke('setBoardModel', [
        'X',
        'O',
        'X',
        'X',
        'O',
        'O',
        'O',
        'X',
        null,
      ])
      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'X')
    })

    it('a draw message is shown', () => {
      cy.get('[data-testid="cell"]').eq(8).click().should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', "It's a draw!")
    })

    it('player X cannot make more moves after a draw', () => {
      cy.get('[data-testid="cell"]').eq(8).click().should('have.text', 'X')
      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', "It's a draw!")
      cy.contains('button', 'Close').click()

      cy.get('[data-testid="cell"]').eq(0).click({force: true})
      cy.wait(250)
      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'X')
    })
  })
})
