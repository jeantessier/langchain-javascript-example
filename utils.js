export const logElapsedTime = async callback => {
    const startingTime = new Date()
    await callback()
    const endingTime = new Date()
    console.log(`(${(endingTime - startingTime) / 1_000} secs)`)
}
