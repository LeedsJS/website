module.exports = () => {
  return {
    title: "Improving Application Predictability With XState",
    speaker: ["sam-edwards"],
    abstract: `Providing users with a clear application journeys is incredibly important, regardless of whether they lead to a successful transaction, or a request for help in the event of an error. But as our applications grow and scale, how do we keep these journeys straight-forward?

One tool which can be used to add discipline to application journeys are state machines, which ensure transitions can only occur between pre-defined states. This talk will focus on one such library for creating state machines for front end applications called XState, created by David Khourshid. Written in TypeScript, feature rich and framework agnostic, XState is an incredibly powerful tool for modelling user journeys.

Featuring lots of examples and demos, I’ll be covering the core functionality of this library in detail, and demonstrating how it can be hooked up to a React application.`,
    date: "2020-04-29",
  };
};
