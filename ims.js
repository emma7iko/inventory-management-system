// Create modal HTML
const modal = document.createElement('div');
modal.innerHTML = `
  <div id="addItemModal" class="modal">
    <div class="modal-content">
      <h3>Add New Item</h3>
      <form id="addItemForm">
        <div class="form-group">
          <label for="itemName">Item Name</label>
          <input type="text" id="itemName" required>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input type="number" id="quantity" required min="0">
        </div>
        <div class="button-group">
          <button type="submit" class="submit-btn">Add Item</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
`;
document.body.appendChild(modal);

// Add styles for modal
const style = document.createElement('style');
style.textContent = `
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .modal.show {
    display: flex;
    opacity: 1;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    margin: auto;
    width: 90%;
    max-width: 500px;
    transform: translateY(-50px);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal.show .modal-content {
    transform: translateY(0);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .button-group button {
    flex: 1;
  }
  
  .cancel-btn {
    background-color: #6c757d !important;
  }
  
  .submit-btn {
    background-color: var(--primary-color);
  }
  
  .table-row-enter {
    animation: slideIn 0.3s ease forwards;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .table-row-exit {
    animation: fadeOut 0.3s ease forwards;
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(20px);
    }
  }
`;
document.head.appendChild(style);

// Handle modal open/close
document.getElementById('addItem').addEventListener('click', function() {
  const modal = document.getElementById('addItemModal');
  modal.classList.add('show');
});

document.querySelector('.cancel-btn').addEventListener('click', function() {
  const modal = document.getElementById('addItemModal');
  modal.classList.remove('show');
});

// Handle form submission
document.getElementById('addItemForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const itemName = document.getElementById('itemName').value;
  const quantity = document.getElementById('quantity').value;
  
  if (itemName && quantity) {
    const table = document.getElementById('inventory-table');
    const row = table.insertRow();
    row.classList.add('table-row-enter');
    
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    
    cell1.innerHTML = itemName;
    cell2.innerHTML = quantity;
    cell3.innerHTML = '<button class="delete-btn">Delete</button>';
    
    // Add delete button listener
    const deleteBtn = cell3.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
      const row = this.parentNode.parentNode;
      row.classList.add('table-row-exit');
      setTimeout(() => {
        row.parentNode.removeChild(row);
        updateChart();
      }, 300);
    });
    
    updateChart();
    
    // Reset form and close modal
    document.getElementById('addItemForm').reset();
    document.getElementById('addItemModal').classList.remove('show');
  }
});

let chart = null;

function updateChart() {
  const ctx = document.getElementById('inventoryChart').getContext('2d');
  const table = document.getElementById('inventory-table');
  const items = [];
  const quantities = [];

  for (let i = 0, row; row = table.rows[i]; i++) {
    items.push(row.cells[0].innerText);
    quantities.push(parseInt(row.cells[1].innerText));
  }

  const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
  gradientFill.addColorStop(0, 'rgba(33, 150, 243, 0.8)');
  gradientFill.addColorStop(1, 'rgba(33, 150, 243, 0.2)');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: items,
      datasets: [{
        label: 'Inventory Level',
        data: quantities,
        backgroundColor: gradientFill,
        borderColor: '#2196f3',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 30,
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Inventory Levels',
          color: '#333',
          font: {
            size: 16,
            family: 'Poppins'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              family: 'Poppins'
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Poppins'
            }
          }
        }
      }
    }
  });
}
