describe('Player makes a move', () => {
  describe('starting from an empty board', () => {
    it('plays into the top left field', () => {
      cy.visit('/')

      cy.get('[data-testid="start-new-game-button"]').click()

      cy.get('[data-testid="cell"]').first().click()
      cy.get('[data-testid="cell"]').first().should('have.text', 'X')
    })

    it('plays into the middle field', () => {
      cy.visit('/')

      cy.get('[data-testid="start-new-game-button"]').click()

      cy.get('[data-testid="cell"]').eq(4).click()
      cy.get('[data-testid="cell"]').eq(4).should('have.text', 'X')
    })
  })

  describe('starting from a board where two pieces are already present', () => {
    it('plays into the bottom right field', () => {
      cy.visit('/')

      cy.get('[data-testid="start-new-game-button"]').click()

      cy.get('[data-testid="cell"]').eq(0).should('have.text', '')
      cy.get('[data-testid="cell"]').eq(2).should('have.text', '')
      cy.window().invoke('setBoardModel', [
        'X',
        null,
        'O',
        null,
        null,
        null,
        null,
        null,
        null,
      ])
      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'X')
      cy.get('[data-testid="cell"]').eq(2).should('have.text', 'O')

      cy.get('[data-testid="cell"]').eq(8).click()
      cy.get('[data-testid="cell"]').eq(8).should('have.text', 'X')

      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'X')
      cy.get('[data-testid="cell"]').eq(2).should('have.text', 'O')
    })
  })
})
