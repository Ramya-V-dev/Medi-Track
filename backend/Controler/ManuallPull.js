const config = require("../DBCONFIG/dbConfig");
const db = require("odbc");
const axios = require("axios");
const qs = require("qs"); // Import this for URL encoding
const pdfParse = require('pdf-parse');
const fs = require('fs');


const Manuallpulldata = async (req, res) => {
  try {
    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);

    const getall =
      await connection.query(`select * from Vw_rxqPatient a with(nolock)
        order by a.GlobalId desc , a.PatientName asc ,a.DateOfBirth`);

    // Close the connection
    await connection.close();

    // Send JSON data as response
    res.status(200).json({
      // status: 'Success',
      message: "Data fetched successfully.",
      data: getall,
    });
  } catch (error) {
    console.log("Db not connected :", error);
  }
};

const pulldata = async (req, res) => {
  try {
    const data = req.body;
    let result = "";
    let result1 = "";
    let PatientIdentifier1 = "";
    // const {name} = req.body
    // console.log("data from pull:",data)

    const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
    //  const {updatedTableData} = data;
    // const user = data.name;
    // console.log(user);
    // const keys = Object.keys(data);
    // console.log(name);
    const user = data.name;

    const {
      GlobalId,
      SSN,
      PatientName,
      DisplayName,
      DateOfBirth,
      street,
      city,
      state,
      zip,
      Phone,
      Phone2,
      MediAssist,
      PatientIdentifier,
    } = data.row;

    PatientIdentifier1 = PatientIdentifier;

    // Delete from the medication list
    // const query = `insert into PatientView(
    //   GlobalId,SSN,PatientName,DateOfBirth,street,city,state,zip,Phone
    //   ,Queuename,RecordCreatedBy
    //   ,RecordCreatedDate,RecordModifiedBy,RecordModifiedDate
    //   ,PatientIdentifier,IsManualPull)
    //   values (?, ?, ?, CONVERT(DATE, ?, 120), ? ,?, ?, ?, ?, 'ManuallPULL',
    //   'SS_Manuall', GETDATE(), ?, GETDATE(), ?, 1) `;

    const query = `INSERT INTO PatientView (
            GlobalId, SSN, PatientName, DisplayName, DateOfBirth, Street, City, State, zip, Phone, Phone2, MediAssist,
            Queuename, RecordCreatedBy, RecordCreatedDate, RecordModifiedBy, RecordModifiedDate, 
            PatientIdentifier, IsManualPull
        ) VALUES (?, ?, ?, ?, CONVERT(DATE, ?, 120), ?, ?, ?, ?, ?,?, ?, 'Manual Pull', ?, 
            GETDATE(), ?, GETDATE(), ?, 1)`;

    // // Log parameter values for debugging
    //  console.log('Parameters:', [
    //      GlobalId, SSN, PatientName, DisplayName,DateOfBirth
    //     ,street
    //     ,city
    //     ,state
    //     ,zip
    //     ,Phone,MediAssist,user, user, PatientIdentifier
    //  ]);

    // Execute the query directly using connection.query
    result = await connection.query(query, [
      GlobalId,
      SSN,
      PatientName,
      DisplayName,
      DateOfBirth,
      street,
      city,
      state,
      zip,
      Phone,
      Phone2,
      MediAssist,
      user,
      user,
      PatientIdentifier,
    ]);

    const querypml = "select * from PatientView where PatientIdentifier = ? ";
    result1 = await connection.query(querypml, [PatientIdentifier1]);
    // console.log(result1)

    if (result) {
      res.status(200).json({
        data: result1,
        // message: 'Data inserted successfully.'
      });
    } else {
      throw new Error("Failed to insert data into database.");
    }

    await connection.close();

    // try end here
  } catch (error) {
    console.error("Error Updating data:", error);
    res.status(500).json({
      message: "Failed to insert data into database.",
      error: error.message,
    });
  }
};

//  const CsvpdfFile= async (req,res)=> {
//         // const table = req.body
//     try {
//        const connectionString =`Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`
//         const connection = await db.connect(connectionString);
  
  
//        const pdfUrl = 'https://www.cvsspecialty.com/content/dam/enterprise/specialty/pdfs/SpecialtyDrugs.pdf';
//     const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

//     // Step 2: Parse PDF content
//     const pdfData = await pdfParse(response.data);
//     const fullText = pdfData.text;

//     // Step 3: Extract rows that look like table data
//     const tableData = extractTableData(fullText);
//     console.log('Parsed Table Rows:', tableData.length);

//     // Step 4: Insert into DB
//     // const db = await odbc.connect(connectionString);
//     for (const row of tableData) {
//       const { TherapyClass, BrandName, GenericName } = row;
//       const query = `INSERT INTO CsvFlile (TherapyClass, BrandName, GenericName) VALUES (?, ?, ?)`;
//       await connection.query(query, [TherapyClass, BrandName, GenericName]);
//     }

//     await connection.close();
//     res.json({ success: true, inserted: tableData.length });

//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ error: 'Failed to extract or insert data' });
//   }
//   }


//   function extractTableData(text) {
//   const lines = text.split('\n').map(line => line.trim()).filter(line => line);
//   const result = [];
//   let inTable = false;
//   let currentRow = { TherapyClass: '', BrandName: '', GenericName: '' };
//   let expectedNext = 'therapy'; // therapy -> brand -> generic
  
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
    
//     // Detect table start
//     if (!inTable && line.toLowerCase().includes('therapy class')) {
//       inTable = true;
//       continue;
//     }
    
//     // Detect table end
//     if (inTable && line.toLowerCase().includes('*indicates')) {
//       if (currentRow.TherapyClass && currentRow.BrandName) {
//         result.push({...currentRow});
//       }
//       break;
//     }
    
//     if (inTable && line.length > 2) {
//       // Skip header and footer lines
//       if (line.includes('CVS') || line.includes('All rights reserved')) {
//         continue;
//       }
      
//       if (expectedNext === 'therapy' ) {
//         // Save previous row if complete
//         if (currentRow.TherapyClass && currentRow.BrandName) {
//           result.push({...currentRow});
//         }
//         // Start new row
//         currentRow = { TherapyClass: line, BrandName: '', GenericName: '' };
//         expectedNext = 'brand';
//       } else if (expectedNext === 'brand' ) {
//         currentRow.BrandName = line;
//         expectedNext = 'generic';
//       } else if (expectedNext === 'generic' ) {
//         currentRow.GenericName = line;
//         expectedNext = 'therapy';
//       }
//     }
//   }
  
//   return result;
// }


const PDF_URL = 'https://www.cvsspecialty.com/content/dam/enterprise/specialty/pdfs/SpecialtyDrugs.pdf';
const PDF_FILE = 'SpecialtyDrugs.pdf';

// Download PDF
async function downloadPDF() {
  const response = await axios.get(PDF_URL, { responseType: 'arraybuffer' });
  fs.writeFileSync(PDF_FILE, response.data);
}

// Extract table data
 const extractTableData = async () => {
  const dataBuffer = fs.readFileSync(PDF_FILE);
  const data = await pdfParse(dataBuffer);

  const lines = data.text.split('\n').map(line => line.trim());
  const tableRows = [];
  let capture = false;

  for (const line of lines) {
    if (
      line.toLowerCase().includes('therapy class') &&
      line.toLowerCase().includes('brand name') &&
      line.toLowerCase().includes('generic name')
    ) {
      capture = true;
      continue;
    }
    if (!capture) continue;
    if (!line) continue;
    if (capture) console.log(line);

    const cols = line.split(/\s{2,}/).map(col => col.trim());
    if (cols.length >= 3) {
      tableRows.push({
        Therapy: cols[0],
        Brand: cols[1],
        Generic: cols[2]
      });
    }
  }
  return tableRows;
}


// Insert data into SQL Server via ODBC
const insertIntoDB = async(rows) =>  {
   const connectionString = `Driver=${config.driver};Server=${config.server};Database=${config.database};Trusted_Connection=yes;`;
    const connection = await db.connect(connectionString);
  try {
    for (const row of rows) {
      // Adjust table and column names as needed
      await connection.query(
        `INSERT INTO DrugCsv (TherapyClass, BrandName, GenericName) VALUES (?, ?, ?)`,
        [row.Therapy, row.Brand, row.Generic]
      );
    }
  } finally {
    await connection.close();
  }
}

// REST API endpoint
const CsvpdfFile = async (req, res) => {
  try {
    await downloadPDF();
    const tableRows = await extractTableData();
    if (!tableRows.length) {
      return res.status(400).json({ message: 'No table data found in PDF.' });
    }
    await insertIntoDB(tableRows);
    res.json({ message: 'Table data imported successfully!', count: tableRows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error importing data', error: err.message });
  }
};

module.exports = {
  Manuallpulldata,
  pulldata,
  CsvpdfFile
};
