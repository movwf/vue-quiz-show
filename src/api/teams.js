import localSave from '@/services/localSave.js'

const updateTeamPoint = (teamId, amount) => {
  const teamData = localSave.getTeamsData()

  if (teamData) {
    const currentTeamIdx = teamData.findIndex((t) => t.order === teamId)

    const updatedTeamData = [...teamData]
    const currentTeam = updatedTeamData.find((t) => t.order === teamId)

    currentTeam.points = Number(currentTeam.points) + Number(amount)

    updatedTeamData.splice(currentTeamIdx, 1, currentTeam)

    localSave.saveTeams(updatedTeamData)
  }
}

const useTeamJoker = (teamId, jokerType) => {
  const teamData = localSave.getTeamsData()

  if (teamData) {
    const currentTeamIdx = teamData.findIndex((t) => t.order === teamId)

    const updatedTeamData = [...teamData]
    const currentTeam = updatedTeamData.find((t) => t.order === teamId)
    const currentTeamJokers = currentTeam.jokers.split(',')
    const jokerIdx = currentTeamJokers.findIndex((j) => j === jokerType)

    if (jokerIdx !== -1) currentTeamJokers.splice(jokerIdx, 1)

    currentTeam.jokers = currentTeamJokers.join(',')

    updatedTeamData.splice(currentTeamIdx, 1, currentTeam)

    localSave.saveTeams(updatedTeamData)
  }
}

const returnTeamJoker = (teamId, jokerType) => {
  const teamData = localSave.getTeamsData()

  if (teamData) {
    const currentTeamIdx = teamData.findIndex((t) => t.order === teamId)

    const updatedTeamData = [...teamData]
    const currentTeam = updatedTeamData.find((t) => t.order === teamId)

    switch (jokerType) {
      case 'risc':
        currentTeam.jokers = ['riziko', currentTeam.jokers].join(',')
        break
      default:
        currentTeam.jokers = [currentTeam.jokers, jokerType].join(',')
        break
    }

    updatedTeamData.splice(currentTeamIdx, 1, currentTeam)

    localSave.saveTeams(updatedTeamData)
  }
}

export default {
  updateTeamPoint,
  returnTeamJoker,
  useTeamJoker
}
