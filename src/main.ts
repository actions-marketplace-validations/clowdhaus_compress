import * as core from '@actions/core'
import Upx from './upx'
import stringArgv from 'string-argv'

async function run(): Promise<void> {
  try {
    const commands = stringArgv(core.getInput('commands', {required: false}).trim())
    const options = stringArgv(core.getInput('options', {required: false}).trim())
    const file = core.getInput('file', {required: true}).trim()

    const upx = await Upx.getOrInstall()
    // upx [-123456789dlthVL] [-qvfk] [-o file] file..
    // upx [commands] [options] file
    const args = [...commands, ...options, file]

    const version = await upx.callStdout(['--version'])
    core.debug(version)

    const result = await upx.callStdout(args)
    core.setOutput('output', result)
  } catch (error) {
    core.setFailed(JSON.stringify(error, null, 4))
  }
}

run()
