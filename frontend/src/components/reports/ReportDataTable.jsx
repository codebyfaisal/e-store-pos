const ReportDataTable = ({ title, headers, data, renderRow }) => (
  <div className="card bg-base-100">
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => renderRow(item, i))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ReportDataTable;