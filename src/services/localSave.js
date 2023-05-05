const ls = window.localStorage

const getQuestionsData = () => {
  const data = ls.getItem('question-bank')
  if (data) return JSON.parse(data)
  return data
}

const saveQuestions = (data) => {
  try {
    ls.setItem('question-bank', JSON.stringify(data))
    return true
  } catch (error) {
    return false
  }
}

const getTeamsData = () => {
  const data = ls.getItem('team-bank')
  if (data) return JSON.parse(data)
  return null
}

const saveTeams = (data) => {
  try {
    ls.setItem('team-bank', JSON.stringify(data))
    return true
  } catch (error) {
    return false
  }
}

export default {
  saveTeams,
  getTeamsData,
  saveQuestions,
  getQuestionsData
}
