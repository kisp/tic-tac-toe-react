describe('Past Games', () => {
  beforeEach(() => {
    localStorage.clear()
    cy.visit('/')
  })

  it('shows "No games played yet" when no games have been played', () => {
    cy.get('[data-testid="no-past-games"]').should(
      'have.text',
      'No games played yet',
    )
    cy.get('[data-testid="past-games-list"]').should('not.exist')
    cy.get('[data-testid="clear-history-button"]').should('not.exist')
  })

  it('shows a completed game in Past Games after winning and closing', () => {
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

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

    cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

    cy.get('[data-testid="game-ends-message"]')
      .should('be.visible')
      .and('have.text', 'The winner is X!')

    cy.contains('button', 'Close').click()

    cy.contains('button', 'Return to Welcome Page').click()

    cy.get('[data-testid="start-new-game-button"]').should('exist')

    cy.get('[data-testid="past-games-list"]').should('exist')
    cy.get('[data-testid="past-game-card"]').should('have.length', 1)
    cy.get('[data-testid="past-game-card"]').contains('X won!')
    cy.get('[data-testid="past-game-card"]').contains('Deterministic')
  })

  it('shows a draw game in Past Games', () => {
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

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

    cy.get('[data-testid="cell"]').eq(8).click().should('have.text', 'X')

    cy.get('[data-testid="game-ends-message"]')
      .should('be.visible')
      .and('have.text', "It's a draw!")

    cy.contains('button', 'Close').click()
    cy.contains('button', 'Return to Welcome Page').click()

    cy.get('[data-testid="start-new-game-button"]').should('exist')
    cy.get('[data-testid="past-games-list"]').should('exist')
    cy.get('[data-testid="past-game-card"]').should('have.length', 1)
    cy.get('[data-testid="past-game-card"]').contains('Draw')
  })

  it('shows multiple past games in reverse order', () => {
    // Play first game (X wins with deterministic)
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

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
    cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

    cy.get('[data-testid="game-ends-message"]')
      .should('be.visible')
      .and('have.text', 'The winner is X!')

    cy.contains('button', 'Close').click()
    cy.contains('button', 'Return to Welcome Page').click()

    // Play second game (draw)
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

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
    cy.get('[data-testid="cell"]').eq(8).click().should('have.text', 'X')

    cy.get('[data-testid="game-ends-message"]')
      .should('be.visible')
      .and('have.text', "It's a draw!")

    cy.contains('button', 'Close').click()
    cy.contains('button', 'Return to Welcome Page').click()

    cy.get('[data-testid="past-game-card"]').should('have.length', 2)
    // Most recent game (draw) should appear first
    cy.get('[data-testid="past-game-card"]').eq(0).contains('Draw')
    cy.get('[data-testid="past-game-card"]').eq(1).contains('X won!')
  })

  it('shows the strategy used in each past game', () => {
    // Play a game with Minimax strategy
    cy.get('[data-testid="strategy-minimax"]').click()
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

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
    cy.get('[data-testid="cell"]').eq(4).click().should('have.text', 'X')

    cy.get('[data-testid="game-ends-message"]')
      .should('be.visible')
      .and('have.text', 'The winner is O!')

    cy.contains('button', 'Close').click()
    cy.contains('button', 'Return to Welcome Page').click()

    cy.get('[data-testid="past-game-card"]').should('have.length', 1)
    cy.get('[data-testid="past-game-card"]').contains('O won!')
    cy.get('[data-testid="past-game-card"]').contains('Minimax')
  })

it('can clear history with the Clear History button', () => {
      // Play a game first
      cy.get('[data-testid="start-new-game-button"]').click()
      cy.get('[data-testid="game"]').should('exist')

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
      cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

      cy.get('[data-testid="game-ends-message"]')
        .should('be.visible')
        .and('have.text', 'The winner is X!')

      cy.contains('button', 'Close').click()
      cy.contains('button', 'Return to Welcome Page').click()

      cy.get('[data-testid="past-games-list"]').should('exist')
      cy.get('[data-testid="clear-history-button"]').should('exist')

      cy.get('[data-testid="clear-history-button"]').click()

      // Confirmation dialog should appear
      cy.get('[data-testid="clear-history-dialog-message"]')
        .should('be.visible')
        .and(
          'have.text',
          'Are you sure you want to clear all game history? This action cannot be undone.',
        )

      cy.get('[data-testid="clear-history-confirm-button"]').click()

      cy.get('[data-testid="no-past-games"]').should(
        'have.text',
        'No games played yet',
      )
      cy.get('[data-testid="past-games-list"]').should('not.exist')
    })

  it('persists past games across page reloads', () => {
    cy.get('[data-testid="start-new-game-button"]').click()
    cy.get('[data-testid="game"]').should('exist')

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
    cy.get('[data-testid="cell"]').eq(2).click().should('have.text', 'X')

    cy.get('[data-testid="game-ends-message"]')
      .should('be.visible')
      .and('have.text', 'The winner is X!')

    cy.contains('button', 'Close').click()
    cy.contains('button', 'Return to Welcome Page').click()

    cy.get('[data-testid="past-game-card"]').should('have.length', 1)

    cy.reload()

    cy.get('[data-testid="past-game-card"]').should('have.length', 1)
    cy.get('[data-testid="past-game-card"]').contains('X won!')
  })
})
