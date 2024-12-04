let currentEditId = null;

async function fetchBooks(search = '') {
    try {
        const response = await fetch(`api.php?action=read&search=${encodeURIComponent(search)}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching books');
    }
}

function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Judul</th>
                    <th>Penulis</th>
                    <th>Tahun</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;

    books.forEach(book => {
        html += `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.price}</td>
                <td>${book.stock}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editBook(${JSON.stringify(book).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="delete-btn" onclick="deleteBook(${book.id})">Hapus</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    bookList.innerHTML = html;
}

async function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: parseInt(document.getElementById('year').value),
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    try {
        let url = 'api.php?action=create';
        let method = 'POST';

        if (currentEditId) {
            url = 'api.php?action=update';
            formData.id = currentEditId;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }

        resetForm();
        fetchBooks();
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving book');
    }
}

function editBook(book) {
    currentEditId = book.id;
    document.getElementById('bookId').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('year').value = book.year;
    document.getElementById('price').value = book.price;
    document.getElementById('stock').value = book.stock;
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`api.php?action=delete&id=${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }

        fetchBooks();
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting book');
    }
}

function resetForm() {
    currentEditId = null;
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
}

function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    fetchBooks(searchTerm);
}

document.getElementById('bookForm').addEventListener('submit', handleSubmit);
document.addEventListener('DOMContentLoaded', () => fetchBooks());