
async function loadDictionary() {
  const response = await fetch('aviation_data_dictionary.json');
  const data = await response.json();
  const tbody = document.querySelector('#dictionaryTable tbody');
  const searchInput = document.getElementById('searchInput');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  const filters = { source_system: new Set(), data_type: new Set() };
  const rowsPerPage = 25;
  let currentPage = 1;
  const sanitize = str => String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  function populateFilters() {
    const sourceSet = new Set(), typeSet = new Set();
    data.forEach(d => { sourceSet.add(d.source_system); typeSet.add(d.data_type); });
    const renderCheckboxes = (set, id, key) => {
      const container = document.getElementById(id); container.innerHTML = '';
      [...set].sort().forEach(val => {
        const input = document.createElement('input'); input.type = 'checkbox'; input.value = val;
        input.onchange = () => { input.checked ? filters[key].add(val) : filters[key].delete(val); renderTable(); };
        const label = document.createElement('label'); label.appendChild(input); label.append(" " + val);
        container.appendChild(label);
      });
    };
    renderCheckboxes(sourceSet, 'sourceSystemFilter', 'source_system');
    renderCheckboxes(typeSet, 'dataTypeFilter', 'data_type');
  }
  function getFilteredData() {
    return data.filter(row => {
      const srcMatch = !filters.source_system.size || filters.source_system.has(row.source_system);
      const typeMatch = !filters.data_type.size || filters.data_type.has(row.data_type);
      const textMatch = Object.values(row).some(v => v.toLowerCase().includes(searchInput.value.toLowerCase()));
      return srcMatch && typeMatch && textMatch;
    });
  }
  function renderTable() {
    const filtered = getFilteredData();
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);
    tbody.innerHTML = '';
    paginated.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${sanitize(row.data_element)}</td><td>${sanitize(row.description)}</td>
        <td>${sanitize(row.source_system)}</td><td>${sanitize(row.data_type)}</td>
        <td>${sanitize(row.sample_value)}</td><td>${sanitize(row.compliance_relevance)}</td>
        <td>${sanitize(row.controlled_vocab)}</td>`;
      tbody.appendChild(tr);
    });
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filtered.length / rowsPerPage)}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= Math.ceil(filtered.length / rowsPerPage);
  }
  prevBtn.onclick = () => { if (currentPage > 1) currentPage--; renderTable(); };
  nextBtn.onclick = () => { currentPage++; renderTable(); };
  searchInput.oninput = () => { currentPage = 1; renderTable(); };
  populateFilters(); renderTable();
}
loadDictionary();
