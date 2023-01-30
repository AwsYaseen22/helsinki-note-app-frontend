describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Aws',
      username: 'aws',
      password: 'aws'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened',  function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('aws')
    cy.get('#password').type('yaseen')
    cy.get('#login-button').click()

    // cy.get('.error').contains('wrong credentials')
    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Aws logged in')
  })

  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('aws')
    cy.get('#password').type('aws')
    cy.get('#login-button').click()
    cy.contains('Aws logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      // cy.contains('login').click()
      // cy.get('#username').type('aws')
      // cy.get('#password').type('aws')
      // cy.get('#login-button').click()

      // Use custom command
      cy.login({ username: 'aws', password: 'aws' })
    })

    // it('a new note can be created', function() {
    //   cy.contains('new note').click()
    //   cy.get('#new_note').type('a note created by cypress 999')
    //   cy.contains('save').click()
    //   cy.contains('a note created by cypress 999')
    // })

    describe('and a note exists', function () {
      beforeEach(function () {
        // cy.contains('new note').click()
        // cy.get('input').type('another note cypress')
        // cy.contains('save').click()

        // use Custom command
        cy.createNote({
          content: 'another note cypress',
          important: false
        })
      })

      it('it can be made important', function () {
        cy.contains('another note cypress').parent().find('button')
          // .contains('make important')
          .click()

        cy.contains('another note cypress').parent().find('button').should('contain', 'make not important')
      })
    })

    describe('and several notes exist', function(){
      beforeEach(function(){
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })
      it('one of those can be made important', function () {
        cy.contains('second note')
          .parent()
          .find('button')
          .as('theButton')
        cy.get('@theButton')
          .click()
        cy.get('@theButton')
          .should('contain', 'make not important')
      })
      it('then example', function(){
        cy.get('button').then(buttons => {
          console.log(buttons)
          console.log('number of buttons: ', buttons.length)
        })
      })
    })
  })

})