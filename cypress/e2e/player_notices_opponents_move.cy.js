describe("Player notices opponent's move", () => {
  describe('starting from an empty board', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.get('[data-testid="start-new-game-button"]').click()
      cy.get('[data-testid="game"]').should('exist')
    })

    it('an O piece appears after player places an X', () => {
      cy.get('[data-testid="cell"]').eq(4).click().should('have.text', 'X')

      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'O')
    })
  })
})
