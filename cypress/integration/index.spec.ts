describe("Panda Type", () => {
  it("works", async () => {
    cy.visit("localhost:1234");

    cy.document().then((doc) => {
      const inputBox = cy.findByTestId("typingScreenWords");
      const wordsToType = (doc.querySelector(`[data-testid=typingScreenTextBox]`) as HTMLElement).dataset
        .wordstotype as string;

      inputBox.should("exist");
      inputBox.type(wordsToType, {
        delay: 30,
      });
      inputBox.should("not.exist");

      const wpmContainer = cy.findByTestId("resultWpm");
      const rawWpmContainer = cy.findByTestId("resultRawWpm");
      const accuracyContainer = cy.findByTestId("resultAccuracy");
      const timeTakenContainer = cy.findByTestId("resultTimeTaken");

      wpmContainer.should("exist");
      rawWpmContainer.should("exist");
      accuracyContainer.should("exist");
      timeTakenContainer.should("exist");
    });
  });
});
