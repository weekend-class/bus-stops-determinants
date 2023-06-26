# Penentu Halte Destinasi Transjakarta

## Pendahuluan

Diketahui koridor 1 Bus Transjakarta melewati beberapa halte, antara lain:

- 1-1: Blok M
- 1-2: CSW-ASEAN
- 1-3: Masjid Agung
- 1-4: Bundaran Senayan
- 1-5: GBK
- 1-6: Polda
- 1-7: Bendungan Hilir Semanggi
- 1-8: Karet Sudirman
- 1-9: Dukuh Atas
- 1-10: Tosari

Trayek koridor 1, antara 1-1: Blok M dan 1-10: Tosari, dapat direpresentasikan sebagai berikut:

```
                  +--------+        Transit        +---+---------+
                  | Blok M |<--------------------> | CSW-ASEAN   |
                  +---+----+                       +---+---------+
                      |                                   |
                      |                                   |
                      |                                   |
                      |                                   |
                      v                                   |
          +-----------------+           Transit           |
          | Masjid Agung    |<----------------------------|
          +---+-------------+
              |
              |
              v
    +--------------------+
    | Bundaran Senayan   |
    +---+----------------+
        |
        |
        v
  +----------------------+
  |        GBK           |
  +----------------------+
        |
        |
        v
   +--------+                      +--------------------------+
   |  Polda |--------------------->| Bendungan Hilir Semanggi |
   +--------+                      +--------------------------+
                                                ^
                                                |
+------------------------+         Transit      |
|   Karet Sudirman       |<----------------------
+------------------------+
        |
        |
        v
   +------------------+
   |   Dukuh Atas     |
   +------------------+
        |
        |
        v
    +------------+
    |   Tosari   |
    +------------+

```

Tulislah sebuah program untuk mencari jalur terpendek antara dua halte bus (destinasi awal dan destinasi akhir). Program tersebut harus mengembalikan sebuah array berisi halte-halte bus dalam jalur terpendek, untuk setiap halte.

Implementasikan method bernama `findShortestPath` yang menerima 2 parameter, yaitu `source` sebagai destinasi awal, dan `destination` sebagai destinasi akhir. Dimana kedua parameter tersebut akan diisi oleh nomor halte sebagai argumen.

Petunjuk: pelajari data struktur graph dan algoritma djikstra

## Test Cases

- `findShortestPath("1-1", "1-1") // ["1-1"]`
- `findShortestPath("1-1", "1-2") // ["1-1", "1-2"]`
- `findShortestPath("1-1", "1-6") // ["1-1", "1-3", "1-4", "1-5", "1-6"]`
- `findShortestPath("1-2", "1-4") // ["1-2", "1-3", "1-4"]`
- `findShortestPath("1-8", "1-1") // ["1-8", "1-7", "1-6", "1-5", "1-4", "1-3", "1-1"]`
