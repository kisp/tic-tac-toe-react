describe('Player wins game', () => {
  describe('when winning on a row', () => {
    it('a winning message is show', () => {
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

      cy.get('[data-testid="cell"]').eq(3).should('have.text', '')

      // TODO: check here again after 2000ms
      // cy.wait(2000)
      // cy.get('[data-testid="game-ends-message"]')
      //   .should('be.visible')
      //   .and('have.text', 'The winner is X!')
      // cy.get('[data-testid="cell"]').eq(3).should('have.text', '')
    })
  })
})
