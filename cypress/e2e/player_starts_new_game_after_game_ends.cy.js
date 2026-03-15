describe('Player starts a new game after the current game ends', () => {
  const visitAndStartGame = () => {
    cy.visit('/')
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')
    cy.get('[data-testid="cell"]').eq(0).should('have.text', '')
    cy.get('[data-testid="game-ends-message"]').should('not.exist')
  }

  const returnToWelcomeAndStartNewGame = () => {
    cy.contains('button', 'Return to Welcome Page').click()
    cy.get('[data-testid="start-new-game-button"]').should('exist')
    cy.get('[data-testid="game"]').should('not.exist')

    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

    cy.get('[data-testid="cell"]').each($cell => {
      cy.wrap($cell).should('have.text', '')
    })
    cy.get('[data-testid="game-ends-message"]').should('not.exist')
  }

  beforeEach(visitAndStartGame)

  describe('when X wins and the player starts a new game', () => {
    beforeEach(() => {
      cy.window().invoke('setBoardModel', [
        'X',
        'X',
        null,
        null,
        'O',
        null,
        'O',
        null,
        null,
      ])
      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'X')
    })

    it('resets board when starting new game after win', () => {
      cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is X!')
      cy.contains('button', 'Close').click()

      returnToWelcomeAndStartNewGame()
    })
  })

  describe('when a draw occurs and the player starts a new game', () => {
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

    it('resets board when starting new game after draw', () => {
      cy.get('[data-testid="cell"]').eq(8).click().should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', "It's a draw!")
      cy.contains('button', 'Close').click()

      returnToWelcomeAndStartNewGame()
    })
  })
})
