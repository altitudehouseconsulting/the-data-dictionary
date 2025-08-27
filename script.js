
async function loadDictionary() {
  const res = await fetch('aviation_data_dictionary.json');
  const data = await res.json();
  const tbody = document.querySelector('#dictionaryTable tbody');
  const searchInput = document.getElementById('searchInput');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  const rowsPerPage = 25;
  let currentPage = 1;

  function sanitize(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
  }

  function getFilteredData() {
    return data.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(searchInput.value.toLowerCase()))
    );
  }

  function renderTable() {
    const filtered = getFilteredData();
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    tbody.innerHTML = '';
    paginated.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${sanitize(row.data_element)}</td>
        <td>${sanitize(row.represents)}</td>
        <td>${sanitize(row.regulatory_reference)}</td>
        <td>${sanitize(row.regulatory_summary)}</td>
        <td>${sanitize(row.data_type)}</td>
        <td>${sanitize(row.sample_value)}</td>
      `;
      tbody.appendChild(tr);
    });
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filtered.length / rowsPerPage)}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= Math.ceil(filtered.length / rowsPerPage);
  }

  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
  nextBtn.onclick = () => { currentPage++; renderTable(); };
  searchInput.oninput = () => { currentPage = 1; renderTable(); };

  renderTable();
}
loadDictionary();
