
// Around line 399-408, use the consistent ReferralSource properties
referralSources.map((source, index) => (
  <tr key={index}>
    <td>{source.source || source.name}</td>
    <td>{source.count || source.visits}</td>
    <td>{(source.percentage || source.conversionRate).toFixed(1)}%</td>
  </tr>
))
