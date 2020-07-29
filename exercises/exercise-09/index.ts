import chalk from 'chalk'

/*

Intro:

    We have asynchronous functions now, advanced technology.
    This makes us a tech startup officially now.
    But one of the consultants spoiled our dreams about
    inevitable future IT leadership.
    He said that callback-based asynchronicity is not
    popular anymore and everyone should use Promises.
    He promised that if we switch to Promises, this would
    bring promising results. Promises, promises, promises.

Higher difficulty exercise:

    We don't want to reimplement all the data-requesting
    functions. Let's decorate the old callback-based
    functions with the new Promise-compatible result.
    The final function should return a Promise which
    would resolve with the final data directly
    (i.e. users or admins) or would reject with an error.

    The function should be named promisify.

Run:

    npm run 9

    - OR -

    yarn -s 9

*/

interface User {
  type: 'user'
  name: string
  age: number
  occupation: string
}

interface Admin {
  type: 'admin'
  name: string
  age: number
  role: string
}

type Person = User | Admin

const admins: Admin[] = [
  { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
  { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' },
]

const users: User[] = [
  {
    type: 'user',
    name: 'Max Mustermann',
    age: 25,
    occupation: 'Chimney sweep',
  },
  { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
]

type ApiResponse<T> =
  | {
      status: 'success'
      data: T
    }
  | {
      status: 'error'
      error: string
    }

const oldApi = {
  requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
      status: 'success',
      data: admins,
    })
  },
  requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
      status: 'success',
      data: users,
    })
  },
  requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: 'success',
      data: Date.now(),
    })
  },
  requestCoffeeMachineQueueLength(
    callback: (response: ApiResponse<number>) => void
  ) {
    callback({
      status: 'error',
      error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.',
    })
  },
}

// 原来的题目
// function promisify<T>(fn: unknown): unknown {
//   return null
// }

/**
 * 参考答案
 *
 * 这里 function promisify<T>(fn: (callback: (response: ApiResponse<T>) => void) => void) 后面的 ()=>Promise<T>{} 是一个返回值。
 * 那么这种写法不是函数，这是一个声明。
 *
 * Promise的泛型T代表promise变成成功态之后resolve的值，resolve(value)
 *
 * 理解顺序：
 * 1、传入参数fn，这个参数是一个函数
 * 2、promisify函数的返回值是一个Promise请求得到的数据，这个数据是从函数 ()=> Promise<T>{} 中获取的
 * 3、函数 ()=> Promise<T>{}  中返回的数据为 return ()=>{这里返回的 new Promise()}
 *
 * todo 这里需要好好理解 Promise 的具体概念。
 */
function promisify<T>(
  fn: (callback: (response: ApiResponse<T>) => void) => void
): () => Promise<T> {
  /**
   * 这里为什么要这样写 ？
   *
   * 这里需要返回的是 “能够创建” Promise 这个构造函数的函数，并且得到运行结果。
   * 如果直接使用 “return new Promise()” 那么就是直接创建“Promise函数”，并没有运行。
   * 而前面的“Promise<T>”表示“返回一个Promise的成功状态”
   */
  return () =>
    new Promise((resolve, reject) => {
      fn((res) => {
        if (res.status === 'success') {
          resolve(res.data)
        } else {
          reject(res.error)
        }
      })
    })
}

const api = {
  requestAdmins: promisify(oldApi.requestAdmins),
  requestUsers: promisify(oldApi.requestUsers),
  requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),
  requestCoffeeMachineQueueLength: promisify(
    oldApi.requestCoffeeMachineQueueLength
  ),
}

function logPerson(person: Person) {
  console.log(
    ` - ${chalk.green(person.name)}, ${person.age}, ${
      person.type === 'admin' ? person.role : person.occupation
    }`
  )
}

async function startTheApp() {
  console.log(chalk.yellow('Admins:'))
  ;(await api.requestAdmins()).forEach(logPerson)
  console.log()

  console.log(chalk.yellow('Users:'))
  ;(await api.requestUsers()).forEach(logPerson)
  console.log()

  console.log(chalk.yellow('Server time:'))
  console.log(
    `   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`
  )
  console.log()

  console.log(chalk.yellow('Coffee machine queue length:'))
  console.log(`   ${await api.requestCoffeeMachineQueueLength()}`)
}

startTheApp().then(
  () => {
    console.log('Success!')
  },
  (e: Error) => {
    console.log(
      `Error: "${e.message}", but it's fine, sometimes errors are inevitable.`
    )
  }
)

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/generics.html
