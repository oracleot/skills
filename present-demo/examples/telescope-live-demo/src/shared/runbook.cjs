// ADAPT: validate every claim, route, prompt, and fallback against the product.
module.exports = {
  opening: { title: 'Turn a signal into a confident next step', subtitle: 'A three-minute Telescope walkthrough using local sample data.' },
  closing: { title: 'From signal to action', takeaway: 'Telescope makes the important change visible, explainable, and easy to share.' },
  steps: [
    { id: 'orient', title: 'Orient', objective: 'Show the team’s operating picture before making a decision.', say: 'The first view tells us where attention is needed, without asking anyone to assemble a report.', action: 'Open the prepared overview.', expected_result: 'The activation trend and priority customer segment are visible.', audience_takeaway: 'The team starts from shared context.', fallback: 'Reload the local fixture overview.', target_path: '/', required_state: 'Local fixture server.', mutates_data: false },
    { id: 'investigate', title: 'Investigate', objective: 'Make the source of the change concrete.', say: 'Now we can move from a trend to the customers and product behavior behind it.', action: 'Open the retention view.', expected_result: 'The affected segment and its leading indicator are visible.', audience_takeaway: 'The product makes a change explainable.', fallback: 'Use the Retention link in the fixture navigation.', target_path: '/retention', required_state: 'Local fixture server.', mutates_data: false },
    { id: 'share', title: 'Share', objective: 'End with an actionable outcome.', say: 'The conclusion is ready to share with the team: focus the onboarding fix on the segment that is slipping.', action: 'Open the decision brief.', expected_result: 'A concise recommended action and owner are visible.', audience_takeaway: 'Insight turns into a clear next step.', fallback: 'Use the Decision brief link in the fixture navigation.', target_path: '/brief', required_state: 'Local fixture server.', mutates_data: false }
  ]
};
