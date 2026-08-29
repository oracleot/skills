// ADAPT: match the confirmed audience and demo-only runtime; validate product claims and routes.
module.exports = {
  audience: 'Product stakeholders',
  duration_minutes: 5,
  opening: { title: 'A clear product outcome', subtitle: 'A short, reliable live walkthrough.', estimated_seconds: 30 },
  closing: { title: 'From question to outcome', takeaway: 'The product makes the important next step clear.', estimated_seconds: 30 },
  steps: [
    { id: 'discover', title: 'Discover', objective: 'Establish the starting point.', say: 'We start where the customer’s work begins.', action: 'Navigate to the workflow’s entry point in the integrated browser.', expected_result: 'The workflow entry point is visible.', audience_takeaway: 'The workflow starts with context.', fallback: 'Use the editable address field to return to the confirmed environment URL.', target_path: '/', estimated_seconds: 240 }
  ]
};
