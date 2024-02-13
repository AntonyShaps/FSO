describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "root",
      username: "root",
      password: "root",
    };
    const user2 = {
      name: "root2",
      username: "root2",
      password: "root2",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.request("POST", "http://localhost:3003/api/users/", user2);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  it("succeeds with correct credentials", function () {
    cy.get("#username").type("root");
    cy.get("#password").type("root");
    cy.get("#login-button").click();
    cy.contains("root logged in");
  });

  it("fails with wrong credentials", function () {
    cy.get("#username").type("root");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();
    cy.get(".error").contains("wrong username or password");
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type("root");
      cy.get("#password").type("root");
      cy.get("#login-button").click();
      cy.contains("root logged in");
    });

    it("A blog can be created and appeares in the list", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("root");
      cy.get("#author").type("root");
      cy.get("#url").type("root");
      cy.contains("save").click();

      cy.contains("a new blog root by root added");
      cy.contains("show");
    });
    it("A blog can be liked", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("root");
      cy.get("#author").type("root");
      cy.get("#url").type("root");
      cy.contains("save").click();

      cy.contains("a new blog root by root added");
      cy.contains("show").click();
      cy.get("#like-button").click();
    });
    it("A blog can be deleted", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("root");
      cy.get("#author").type("root");
      cy.get("#url").type("root");
      cy.contains("save").click();

      cy.contains("a new blog root by root added");
      cy.contains("show").click();
      cy.contains("remove").click();
    });
    it("A blog delete is visible only to creator", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("root");
      cy.get("#author").type("root");
      cy.get("#url").type("root");
      cy.contains("save").click();
      cy.contains("logout").click();
      cy.get("#username").type("root2");
      cy.get("#password").type("root2");
      cy.get("#login-button").click();
      cy.contains("root2 logged in");
      cy.contains("show").click();
      cy.contains("remove").should("not.exist");
    });
    it("blogs are ordered according to likes with the blog with the most likes being first", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("The title with the most likes");
      cy.get("#author").type("root");
      cy.get("#url").type("root");
      cy.contains("save").click();
      cy.contains("show").click();
      cy.wait(1000);
      cy.get("#like-button").click();
      cy.wait(1000);

      cy.contains("new blog").click();
      cy.get("#title").type("The title with the second most likes");
      cy.get("#author").type("root");
      cy.get("#url").type("root");
      cy.contains("save").click();
      cy.wait(1000);
      cy.get(".blogg").eq(0).should("contain", "The title with the most likes");
      cy.get(".blogg")
        .eq(1)
        .should("contain", "The title with the second most likes");
    });
  });
});
