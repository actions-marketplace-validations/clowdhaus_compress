import * as core from '@actions/core'
// import stringArgv from 'string-argv'

import Upx from './upx'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    const upx = await Upx.getOrInstall()
    const result = await upx.callStdout(['--version'])
    core.debug(result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
