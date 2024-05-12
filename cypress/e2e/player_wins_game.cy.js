describe('Player wins game', () => {
  const visitAndStartGame = () => {
    cy.visit('/')
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')
    cy.get('[data-testid="cell"]').eq(0).should('have.text', '')
    cy.get('[data-testid="game-ends-message"]').should('not.exist')
  }

  beforeEach(visitAndStartGame)

  describe('when X wins on a row', () => {
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

    it('a winning message is shown', () => {
      cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is X!')
      cy.wait(2000)
      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is X!')
    })

    it('player O will make no more moves', () => {
      cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

      cy.get('[data-testid="cell"]').eq(3).should('have.text', '')
      cy.wait(2000)
      cy.get('[data-testid="cell"]').eq(3).should('have.text', '')
    })

    // TODO: work on: player X cannot make more moves
    // it('player X cannot make more moves', () => {
    //   cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')
    //   cy.get('[data-testid="game-ends-message"]')
    //     .should('be.visible')
    //     .and('have.text', 'The winner is X!')

    //   cy.get('[data-testid="cell"]').eq(3).click()
    //   cy.wait(250)
    //   cy.get('[data-testid="cell"]').eq(3).should('have.text', '')
    // })
  })

  describe('when O wins on a row', () => {
    beforeEach(() => {
      cy.window().invoke('setBoardModel', [
        'O',
        'O',
        null,
        null,
        null,
        null,
        'X',
        'X',
        null,
      ])
      cy.get('[data-testid="cell"]').eq(0).should('have.text', 'O')
    })

    it('a winning message is shown', () => {
      cy.get('[data-testid="cell"]').eq(4).click().should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is O!')
    })

    // TODO: work on: player X cannot make more moves
    // it('player X cannot make more moves', () => {
    //   cy.get('[data-testid="cell"]').eq(4).click().should('have.text', 'X')
    //   cy.get('[data-testid="game-ends-message"]')
    //     .should('be.visible')
    //     .and('have.text', 'The winner is O!')

    //   cy.get('[data-testid="cell"]').eq(8).click()
    //   cy.wait(250)
    //   cy.get('[data-testid="cell"]').eq(8).should('have.text', '')
    // })
  })
})
