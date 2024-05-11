describe('Player wins game', () => {
  describe('when X wins on a row', () => {
    it('a winning message is shown', () => {
      cy.visit('/')

      cy.get('[data-testid="start-new-game-button"]').click()

      cy.get('[data-testid="cell"]').eq(0).should('have.text', '')

      cy.get('[data-testid="game-ends-message"]').should('not.exist')

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

      cy.get('[data-testid="cell"]').eq(2).click()
      cy.get('[data-testid="cell"]').eq(2).should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is X!')

      cy.wait(2000)

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is X!')
    })

    it('player O will make no more moves', () => {
      cy.visit('/')

      cy.get('[data-testid="start-new-game-button"]').click()

      cy.get('[data-testid="cell"]').eq(0).should('have.text', '')

      cy.get('[data-testid="game-ends-message"]').should('not.exist')

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

      cy.get('[data-testid="cell"]').eq(2).click()
      cy.get('[data-testid="cell"]').eq(2).should('have.text', 'X')

      cy.get('[data-testid="cell"]').eq(3).should('have.text', '')

      cy.wait(2000)

      cy.get('[data-testid="cell"]').eq(3).should('have.text', '')
    })
  })
})
