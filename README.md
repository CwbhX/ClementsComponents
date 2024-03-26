# Clements Components
Clement's KiCAD Component Library



## DB Setup

#### Manual CSV Importing

1. Clone this repo
2. Setup a MySQL DB Library of your choosing
   1. I personally find this guide from DO pretty useful: [How To Install MySQL on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)
3. Install [DBeaver](https://dbeaver.io/) - a tool used to manage DBs with a GUI
   1. If you're having issues with Java versions (always install the latest directly from Java or Oracle), try [this guide](https://github.com/orgs/dbeaver/discussions/20163) here
4. Run DBeaver and connect to your newly made MySQL server
5. Right-click on your kicad database in the explorer a click on **Import Data** then select a table csv and import it
6. Repeat step 5 for all table csvs in this repo or until you have the tables you require for your project

I hope to have this automated in the future tool

## KiCAD DB Lib Setup

### Windows

1. Download and install the latest MySQL ODBC Connector from their [website](https://dev.mysql.com/downloads/connector/odbc/)
2. Open *ODBC Data Sources (64-bit)* application
3. Under *User DSN* tab, click on the "Add" button on the right-hand side
4. Select *MySQL ODBC 8.3 [or your version] ANSI Driver* and click on "Finish"
5. Enter the details of your MySQL DB, it should look something like:
   1. Data Source Name: kicad
   2. Description: KiCAD Database Library
   3. TCP/IP Server: MySQL Server IP and Port
   4. User: MySQL Username
   5. Password: MySQL Password
   6. Database: kicaddb
6. Press OK to finish
7. Open Kicad 7+ and click on Preferences Pane -> Manage Symbol Libraries...
8. Press the folder icon and select the .kicad_dbl file for your DB Configuration

9. Click OK and if no errors appeared that means it successfully connected to your database!

### MacOS

1. Download [iODBC](https://www.iodbc.org/dataspace/doc/iodbc/wiki/iodbcWiki/Downloads) and install this *before* trying to install MySQL OBDC Driver

2. Download MySQL OBDC Driver from their [website](https://dev.mysql.com/downloads/connector/odbc/)

   1. Detailed instructions [here](https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-installation-binary-macos.html)

   Okay, ngl it got kinda cursed figuring these next parts out but...

3. Open iODBC Administrator app (should've been installed with the first package)

4. Under User DSN (Don't use System DSN) create a new connection with the Add button

5. Make sure to select the ANSI MySQL Driver - the Unicode driver won't work with KiCAD even though I think it's preventing usage of symbols like µ (annoying)

6. Enter the details of your MySQL DB, it should look something like:

   1. Server | ServerIP
   2. Database | kicaddb
   3. User | DB Username
   4. Password | DB Password

7. Open Kicad 7+ and click on Preferences Pane -> Manage Symbol Libraries...

8. Press the folder icon and select the .kicad_dbl file for your DB Configuration

9. Click OK and if no errors appeared that means it successfully connected to your database!

## Included Components

### Symbols
* [CP2102N-A02-GQFN20 (Silicon Labs)](https://www.silabs.com/documents/public/data-sheets/cp2102n-datasheet.pdf)
* [CP2102N-A02-GQFN24 (Silicon Labs)](https://www.silabs.com/documents/public/data-sheets/cp2102n-datasheet.pdf)
* [PTS815 SJK 250 SMTR LFS (C&K)](https://www.ckswitches.com/media/2728/pts815.pdf)
* [SN74HC595BRWNR (TI)](https://www.ti.com/lit/ds/symlink/sn74hc595b.pdf?HQS=TI-null-null-digikeymode-df-pf-null-wwe&ts=1607732633037)
* [SSM6N7002KFU (Toshiba)](https://media.digikey.com/pdf/Data%20Sheets/Toshiba%20PDFs/SSM6N7002KFU.pdf)

### Footprints
* [XT60-PW-M20](https://www.tme.eu/Document/9b8d0c5eb7094295f3d3112c214d3ade/XT60PW%20SPEC.pdf)
* [DX07S016JA1R1500](https://www.jae.com/direct/topics/topics_file_download/?topics_id=91780&ext_no=04&_lang=en&v=2020041313384666992409)
* [1267AY-101M=P3](https://www.murata.com/~/media/webrenewal/products/inductor/chip/tokoproducts/wirewoundferritetypeforpl/m_dg8040c.ashx?la=en)
* [PTS815 SJK 250 SMTR LFS (C&K)](https://www.ckswitches.com/media/2728/pts815.pdf)
* [SN74HC595BRWNR (TI)](https://www.ti.com/lit/ds/symlink/sn74hc595b.pdf?HQS=TI-null-null-digikeymode-df-pf-null-wwe&ts=1607732633037)
* [0ZCJ0050FF2G_3216X125N (Bel Fuse Inc)](https://www.belfuse.com/resources/datasheets/circuitprotection/ds-cp-0zcj-series.pdf)

### 3D Models (May not be dimensionally accurate)
* [XT60-PW-M20](https://www.tme.eu/Document/9b8d0c5eb7094295f3d3112c214d3ade/XT60PW%20SPEC.pdf)
* [DX07S016JA1R1500](https://www.jae.com/direct/topics/topics_file_download/?topics_id=91780&ext_no=04&_lang=en&v=2020041313384666992409)
* [1267AY-101M=P3](https://www.murata.com/~/media/webrenewal/products/inductor/chip/tokoproducts/wirewoundferritetypeforpl/m_dg8040c.ashx?la=en)
* [PTS815 SJK 250 SMTR LFS (C&K)](https://www.ckswitches.com/media/2728/pts815.pdf)
