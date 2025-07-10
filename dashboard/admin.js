// routes/admin.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const user = req.session.user;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Dashboard</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="h-screen flex overflow-hidden">

      <!-- Sidebar -->
	  <aside id="sidebar" class="w-64 bg-gray-800 text-white flex-shrink-0 h-screen overflow-y-auto"></aside>

      <!-- Main content wrapper -->
      <div class="flex flex-col flex-1">

        <!-- Header -->
        <header id="header" class="bg-gray-100 h-16 flex items-center justify-between px-4 border-b border-gray-300"></header>

        <!-- Main content -->
        <main id="konten" class="flex-1 overflow-y-auto p-4 bg-white">
          <h2>Selamat Datang ${user.nama} !</h2>
        </main>
        <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 overflow-auto hidden z-50">
          <div class="min-h-screen flex justify-center py-10">
            <div class="bg-white p-4 rounded shadow-lg w-full max-w-xl" id="modal-content"></div>
          </div>
        </div>



        <!-- Footer -->
        <footer id="footer" class="h-16 bg-gray-100 flex items-center justify-center border-t border-gray-300"></footer>
      </div>

		<script>
		// 1) Load header
		fetch('/sidebar/header').then(r => r.text()).then(html => {
		document.getElementById('header').innerHTML = html;
		});

		// 2) Load sidebar + toggle sublist
		fetch('/sidebar/leftside').then(r => r.text()).then(html => {
		document.getElementById('sidebar').innerHTML = html;

		const toggleJadwalMatkul = document.getElementById('toggleJadwalMatkul');
		const subJadwalMatkul = document.getElementById('subJadwalMatkul');
		if (toggleJadwalMatkul && subJadwalMatkul) {
			toggleJadwalMatkul.addEventListener('click', e => {
			e.preventDefault();
			subJadwalMatkul.classList.toggle('hidden');
			});
		}

		const toggleLab = document.getElementById('toggleLab');
		const subLab = document.getElementById('subLab');
		if (toggleLab && subLab) {
			toggleLab.addEventListener('click', e => {
			e.preventDefault();
			subLab.classList.toggle('hidden');
			});
		}

		const toggleDosen = document.getElementById('toggleDosen');
		const subDosen = document.getElementById('subDosen');
		if (toggleDosen && subDosen) {
			toggleDosen.addEventListener('click', e => {
			e.preventDefault();
			subDosen.classList.toggle('hidden');
			});
		}
		});

		// 3) Load footer
		fetch('/sidebar/footer').then(r => r.text()).then(html => {
		document.getElementById('footer').innerHTML = html;
		});

		// 4) Global click handler
		document.addEventListener('click', function (e) {
		// Sidebar nav AJAX
		if (e.target.classList.contains('ajax')) {
			e.preventDefault();
			fetch(e.target.href)
			.then(res => res.text())
			.then(html => {
				document.getElementById('konten').innerHTML = html;
			});
		}

		// Toggle sidebar (burger)
		if (e.target.id === 'toggleSidebar') {
			document.getElementById('sidebar').classList.toggle('hidden');
		}

		// Modal open
		if (e.target.classList.contains('modal-open')) {
			e.preventDefault();
			fetch(e.target.href)
			.then(res => res.text())
			.then(html => {
				document.getElementById('modal-content').innerHTML = html;
				document.getElementById('modal').classList.remove('hidden');
			});
		}

		// Modal close manual
		if (e.target.id === 'modal-close') {
			document.getElementById('modal').classList.add('hidden');
		}

		// Modal close klik latar
		if (e.target.id === 'modal') {
			e.target.classList.add('hidden');
		}

		// Filter: Ruang Dosen
		if (e.target.id === 'filterTanggal') {
			const tanggalInput = document.getElementById('tanggalInput');
			if (tanggalInput) {
			const tanggal = tanggalInput.value;
			fetch('/dosen/ruangdosen1?tanggal=' + tanggal)
				.then(res => res.text())
				.then(html => {
				document.getElementById('konten').innerHTML = html;
				});
			}
		}

		// Tambah di bagian document.addEventListener('click', ...)
		if (e.target.id === 'btnFilterAPI') {
		const tanggal = document.getElementById('filterTanggalAPI').value;
		fetch('/api/indeks?tanggal=' + tanggal)
			.then(res => res.text())
			.then(html => {
			document.getElementById('konten').innerHTML = html;
			});
		}

		// Filter: Jadwal Matkul
		if (e.target.id === 'filterHari') {
			const hariDropdown = document.getElementById('hariDropdown');
			if (hariDropdown) {
			const hari = hariDropdown.value;
			fetch('/jadwalmatkul/RTF.IV.4?hari=' + hari)
				.then(res => res.text())
				.then(html => {
				document.getElementById('konten').innerHTML = html;
				});
			}
		}
		// Filter: Ruang Lab RTF.IV.4
		if (e.target.id === 'filterTanggalLab') {
		const tanggalInput = document.getElementById('tanggalInput');
		const modeDropdown = document.getElementById('modeDropdown');
		const mode = modeDropdown ? modeDropdown.value : 'lab';

		if (tanggalInput) {
			const tanggal = tanggalInput.value;
			let url = '/lab/RTF.IV.4?tanggal=' + tanggal;

			if (mode === 'api') {
			url += '&mode=api';
			}

			fetch(url)
			.then(res => res.text())
			.then(html => {
				document.getElementById('konten').innerHTML = html;
			});
		}
		}



document.addEventListener('click', function (e) {
	// btn-delete umum
		if (e.target.classList.contains('btn-delete')) {
			e.preventDefault();
			if (confirm('Yakin mau hapus?')) {
			fetch(e.target.href)
				.then(res => res.text())
				.then(response => {
				if (response.trim() === 'sukses') {
					alert('Data dihapus.');
					fetch('/jadwalmatkul/RTF.IV.4')
					.then(r => r.text())
					.then(html => {
						document.getElementById('konten').innerHTML = html;
					});
				} else {
					alert('Gagal hapus.');
				}
				});
			}
		}
		});

	// dosen
if (e.target.classList.contains('btn-delete-lab')) {
	e.preventDefault();
	if (confirm('Yakin mau hapus data LAB?')) {
		fetch(e.target.href)
		.then(res => res.text())
		.then(response => {
			if (response.trim() === 'sukses') {
				alert('Data LAB dihapus.');
				fetch('/lab/RTF.IV.4')
				.then(r => r.text())
				.then(html => {
					document.getElementById('konten').innerHTML = html;
				});
			} else {
				alert('Gagal hapus data LAB.');
			}
		});
	}
}

	// lab
if (e.target.classList.contains('btn-delete-dosen')) {
	e.preventDefault();
	if (confirm('Yakin mau hapus data dosen?')) {
		fetch(e.target.href)
		.then(res => res.text())
		.then(response => {
			if (response.trim() === 'sukses') {
				alert('Data dosen dihapus.');
				fetch('/dosen/ruangdosen1')
				.then(r => r.text())
				.then(html => {
					document.getElementById('konten').innerHTML = html;
				});
			} else {
				alert('Gagal hapus data dosen.');
			}
		});
	}
}
});




		document.addEventListener('submit', function (e) {
			if (e.target.classList.contains('ajax-form')) {
				e.preventDefault();
				const form = e.target;
				const formData = new FormData(form);
				const data = new URLSearchParams();
				for (const pair of formData) {
					data.append(pair[0], pair[1]);
				}

				fetch(form.action, {
					method: 'POST',
					body: data
				})
				.then(res => res.text())
				.then(response => {
					if (response.trim() === 'sukses') {
						alert('Data berhasil disimpan');
						document.getElementById('modal').classList.add('hidden');

						// ✅ Perbaikan di sini:
						// Ambil redirect dari dataset atau fallback ke '/admin'
						const redirectUrl = form.dataset.redirect || '/admin';
						fetch(redirectUrl)
							.then(r => r.text())
							.then(html => {
								document.getElementById('konten').innerHTML = html;
							});
					} else {
						alert(response);
					}
				})
				.catch(err => {
					console.error(err);
					alert('Gagal menyimpan data');
				});
			}
		});

		// 6) Filter mode 
		document.addEventListener('change', function (e) {
		if (e.target.id === 'modeDropdown') {
			const mode = e.target.value;
			const tanggal = document.getElementById('tanggalInput')?.value || '';
			let url = '/lab/RTF.IV.4?mode=' + mode;
			if (mode === 'api') url += '&tanggal=' + tanggal;

			fetch(url)
			.then(res => res.text())
			.then(html => {
				document.getElementById('konten').innerHTML = html;
			});
		}
		});
		</script>




    </body>
    </html>
  `);
});

router.get('/home', (req, res) => {
  const user = req.session.user;
  res.send(`<h2>Selamat Datang ${user.nama} !</h2>`);
});

module.exports = router;
