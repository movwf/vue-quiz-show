const docId = import.meta.env.VITE_GOOGLE_SHEETS_DOC_ID

const headerKeysMapping = {
  grup_adi: 'team_name',
  grup_joker: 'team_jokers',
  grup_puan: 'team_points',
  grup_sira: 'team_order',
  grup_uyeleri: 'team_members',
  soru_sira: 'question_id',
  soru_metin: 'question_text',
  soru_kategori: 'question_category',
  soru_cevap: 'question_answer',
  soru_puan: 'question_points',
  soru_sure: 'question_time'
}

function serializeValues(data) {
  const [headers, ...rows] = data

  return rows.map((row) =>
    row.reduce(
      (prev, next, index) => ({
        ...prev,
        [headerKeysMapping[headers[index]] || headers[index]]: next
      }),
      {}
    )
  )
}

async function init() {
  const gapi = window.gapi
  await new Promise((resolve) => {
    gapi.load('client', () => {
      gapi.client
        .init({
          apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
          discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4'
          ]
        })
        .then(resolve)
    })
  })
}

async function getQuestions() {
  const gapi = window.gapi

  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: docId,
      range: 'Sorular!A1:F150'
    })
    return serializeValues(response.result.values)
  } catch (reason) {
    console.error('Error: ' + reason.result.error.message)
  }
}

async function getTeams() {
  const gapi = window.gapi

  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: docId,
      range: 'Gruplar!A1:E150'
    })

    return serializeValues(response.result.values)
  } catch (reason) {
    console.error('Error: ' + reason.result.error.message)
  }
}

export default {
  init,
  getTeams,
  getQuestions
}
