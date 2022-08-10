import { Request, Response } from 'express'
import Mail from '../lib/Mail'
import Queue from '../lib/Queue'

import { getRedis, redisClient } from '../config/redisConfig'
import userRepository from '../repository/UserRepository'

function functionRedisKey(namespace, id) {
    return `${namespace}:${id}`
}

const mockAddressList = [
    '0xf977814e90da44bfa03b6295a0616a897441acec',
    '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
    '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
    '0x28c6c06298d514db089934071355e5743bf21d60',
    '0x5a52e96bacdabb82fd05763e25335261b270efcb',
    '0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
    '0x21a31ee1afc51d94c2efccaa2092ad1028285549',
    '0x286af5cf60ae834199949bbc815485f07cc9c644',
    '0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2',
    '0xc5a8859c44ac8aa2169afacf45b87c08593bec10',
    '0x1157a2076b9bb22a85cc2c162f20fab3898f4101',
    '0x489447dcb5768602afaba549404cc7e0dfee1b6f',
    '0x00cef0386ed94d738c8f8a74e8bfd0376926d24c',
    '0x4807862aa8b2bf68830e4c8dc86d0e9a998e085a',
    '0xa2e3a2ca689c00f08f34b62ccc73b1477ef1f658',
    '0xccc40e325ffeaa7553ca6224e4b19800ddc49cc1',
    '0xa361718326c15715591c299427c62086f69923d9',
    '0x72a53cdbbcc1b9efa39c834a540550e23463aacb',
    '0x605dfc960eb62396c38eca29e7735d6680219f5c',
    '0x5c9e5ee55fae482f52e4dbb1959f941b4cdcc7b2',
    '0xa65de1354d9ca3023ef8660447dec2b7de54e3c0',
    '0xf1556137e7f45817e774096c5922f32c68ab15ae',
    '0xb747b9a80c6244bb2475dc2e90efe41cc48a7453',
    '0x134750a99286afc269d17eb791b9b670c6c0c91e',
    '0x0f0231b43ee64d53dcae20b89783ee78a48bbc24',
    '0xec2724775004aaba66db5900c2f79d8bb8aca36c',
    '0x7abe0ce388281d2acf297cb089caef3819b13448',
    '0xdb91f52eefe537e5256b8043e5f7c7f44d81f5aa',
    '0x7d8864383037e76ceb8d5bd54e1a432220a105f2',
    '0x11dbf181dd5c075c2abd92cb9579c4809406b5be',
    '0xf9211ffbd6f741771393205c1c3f6d7d28b90f03',
    '0xc3c8e0a39769e2308869f7461364ca48155d1d9e',
    '0x50e447a6aa7d9addee7e28f95009a111c1d93a77',
    '0x603fe178f3a45f986c2b0f227a51be0e9093fe98',
    '0xcffad3200574698b78f32232aa9d63eabd290703',
    '0x00000000ae347930bd1e7b0f35588b92280f9e75',
    '0xe2c3da7fca5d851c28539fa98db2167d1bdf95bb',
    '0x09b176b1a97acbd5390dc6e35b91676e139676f1',
    '0xf60c2ea62edbfe808163751dd0d8693dcb30019c',
    '0x0548f59fee79f8832c299e01dca5c76f034f558e',
    '0x4f1575f7b298851876db234d168b0650b5351925',
    '0x59de657e61bb8ce9555aea85bb85ed799fdd2de7',
    '0xa74fa5bf9461277f805f0a36bb758065a2b9db89',
    '0xfe359dea9cd4d7908c6e6cf0e44090140407efcf',
    '0x43e6ca96c38e50f09388db3e40ac6a6334214171',
    '0xd13eb71515dc48a8a367d12f844e5737bab415df',
    '0x3057455784a4345d11acaa2e2c91e5f0d15bb227',
    '0xda46a67c11c16ce391e6f10c680083dbeee8bb2f',
    '0xdb875397a564569e98f0b95596174bac3d59c782',
    '0x138ef96444fa65a0d6f8c64a9ff2c317100a76ec',
    '0x50b03254e1013ab8325db6576dab1b9c5a7d0f3f',
    '0x4c036c87164f0bc0403252d499b16b10d95e2401',
    '0x04cba702e1591677e3d3cf77952788f35fbf29b0',
    '0x61466641ab6d45120ba906b1a13d1765d50c9671',
    '0xb7699ffc581454725da05ed988ae83ab73c736f4',
    '0x1dcf744103cbe48b7a256d4630d46af32871d333',
    '0xb8dc6043bdad72ba41e4762ce00660369e306d27',
    '0xc3d3660e721a4cf9818bf153d0a32c14513e2a00',
    '0x92333118f60c66de1f3f5bd80272ac3ccc89c408',
    '0x7c9c7acef3273f696cc6eeab621e7429e349d7d6',
    '0xdbd795f4c73983f64edfbce7d6ee2c296492ecec',
    '0xcf6ee9d34f58106e0d99ea6c1fcdfa9c6822f507',
    '0x34ea4138580435b5a521e460035edb19df1938c1',
    '0x18a908ed663823c908a900b934d6249d4befbe44',
    '0xb3c839dbde6b96d37c56ee4f9dad3390d49310aa',
    '0x525a234de4eee961de7a7fabbf43a0ddcc289494',
    '0xbefbd54e79b086fd561fd17056d99b07a6bd33d7',
    '0xa80191fca50be00f8952c69232c93d57eeacaf6f',
    '0x5b55a5a03362064dc464afbe5fbd5746c7fc592b',
    '0xe9dfacb007ddca6821aec172de8f45800e225627',
    '0x333bb3e68a3bf5913b50ce1325d2fb145ee853f6',
    '0x317aa998a3d2d1029169c80f199a517c3ab3612f',
    '0x271cd2c5c0536ecc2044f1c110d6c40b8b082e63',
    '0xaf8f668af4964e51fc31c0e15ff5fc5a9401e7bb',
    '0x2489146cf124a6900ba46c6f76f18ec76d5068b9',
    '0x6262998ced04146fa42253a5c0af90ca02dfd2a3',
    '0x290e09a109c674750375cb4a9637238f23de0221',
    '0xff20d93f44f6da265b20dc77533b191745d04955',
    '0x76aa6b335e2ed32004775bddfdf6d90c3d2f9f4f',
    '0x007990ecc028f0f126201758dd2d80ea6fa9c82e',
    '0xb224228b0fe71cebf95ee25339166cd626759b52',
    '0xaffe4271096c9ecbbde1bb309c60136506989acb',
    '0x8fdb0bb9365a46b145db80d0b1c5c5e979c84190',
    '0x276762e52ffc7e6f6d5ff7a2e449f387d62c418a',
    '0x6fd0d286145fec73e5be4fab8e24247ae8662c98',
    '0x3f4b4e2dba37db2520af5a0b6b0bb08e732b610c',
    '0x29d5527caa78f1946a409fa6acaf14a0a4a0274b',
    '0xdef57ccb20b1f2eaee0c64aab3280350f84cb0fc',
    '0x0a6c3834781d74dc67ccc026d0c635d52602e810',
    '0xe272c02a2d2505c45d7762de87b7e2207c2569e4',
    '0x835e2d5fabd5621de1250130ce5fac6125a0d310',
    '0x5cfaf0250534992d931272e0cea6e5986c669da0',
    '0x7cd7a5a66d3cd2f13559d7f8a052fa6014e07d35',
    '0xb9152d564b9efabdd273b3b88c163546ed96292a',
    '0x9be9cd9c9b2dc0a7b47478e4ba14b08b1f640cc7',
    '0x2463c0303e2869e7295443932efeeacd6ce3bd65',
    '0xd1abe4c71bc6ed7056908c65f23091ccd8c28310',
    '0xc6bd89f570ae2fac958ecbeeeed7d79ffc9260db',
    '0xd47e04c8e9df26c00c75ed24f2e613ad6cefa4df',
    '0x5f0f3b3d335c8071580f3abfbac79b48b74e0494',
    '0x00000000219ab540356cbb839cbe05303d7705fa',
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '0xda9dfa130df4de4673b89022ee50ff26f6ea73cf',
    '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
    '0x0716a17fbaee714f1e6ab0f9d59edbc5f09815c0',
    '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
    '0xf977814e90da44bfa03b6295a0616a897441acec',
    '0x742d35cc6634c0532925a3b844bc454e4438f44e',
    '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
    '0x011b6e24ffb0b5f5fcc564cf4183c5bbbc96d515',
    '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
    '0xa7efae728d2936e78bda97dc267687568dd593f3',
    '0x61edcdf5bb737adffe5043706e7c5bb1f1a56eea',
    '0xe92d1a43df510f82c66382592a047d288f85226f',
    '0x0548f59fee79f8832c299e01dca5c76f034f558e',
    '0xc098b2a3aa256d2140208c3de6543aaef5cd3a94',
    '0x1b3cb81e51011b549d78bf720b0d924ac763a7c2',
    '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
    '0x8484ef722627bf18ca5ae6bcf031c23e6e922b30',
    '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
    '0xca8fa8f0b631ecdb18cda619c4fc9d197c8affca',
    '0x3bfc20f0b9afcace800d73d2191166ff16540258',
    '0x28c6c06298d514db089934071355e5743bf21d60',
    '0x220866b1a2219f40e72f5c628b65d54268ca3a9d',
    '0x6a2c3c4c7169d69a67ae2251c7d765ac79a4967e',
    '0x25eaff5b179f209cf186b1cdcbfa463a69df4c45',
    '0x8103683202aa8da10536036edef04cdd865c225e',
    '0x0a4c79ce84202b03e95b7a692e5d728d83c44c76',
    '0xb29380ffc20696729b7ab8d093fa1e2ec14dfe2b',
    '0x2b6ed29a95753c3ad948348e3e7b1a251080ffb9',
    '0x189b9cbd4aff470af2c0102f365fc1823d857965',
    '0x9acb5ce4878144a74eeededa54c675aa59e0d3d2',
    '0x176f3dab24a159341c0509bb36b833e7fdd0a132',
    '0x78605df79524164911c144801f41e9811b7db73d',
    '0xa929022c9107643515f5c777ce9a910f0d1e490c',
    '0xb9711550ec6dc977f26b73809a2d6791c0f0e9c8',
    '0x9845e1909dca337944a0272f1f9f7249833d2d19',
    '0x7b0419581eb2e34b4d3bfc1689f1bd855d364d9d',
    '0xcb9225bb407bc585ffbb863dc924aad07c97af2c',
    '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1',
    '0x59448fe20378357f206880c58068f095ae63d5a5',
    '0xbddf00563c9abd25b576017f08c46982012f12be',
    '0x558553d54183a8542f7832742e7b4ba9c33aa1e6',
    '0x98ec059dc3adfbdd63429454aeb0c990fba4a128',
    '0x0c23fc0ef06716d2f8ba19bc4bed56d045581f2d',
    '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
    '0xcdbf58a9a9b54a2c43800c50c7192946de858321',
    '0x0d0707963952f2fba59dd06f2b425ace40b492fe',
    '0x475a311edfd2d2a583fcba043d543917a94b85a0',
    '0x66f820a414680b5bcda5eeca5dea238543f42054',
    '0xbf3aeb96e164ae67e763d9e050ff124e7c3fdd28',
    '0xdc1487e092caba080c6badafaa75a58ce7a2ec34',
    '0x36a85757645e8e8aec062a1dee289c7d615901ca',
    '0x550cd530bc893fc6d2b4df6bea587f17142ab64e',
    '0x1db92e2eebc8e0c075a02bea49a2935bcd2dfcf4',
    '0x9cf36e93a8e2b1eaaa779d9965f46c90b820048c',
    '0xa160cdab225685da1d56aa342ad8841c3b53f291',
    '0xa7e4fecddc20d83f36971b67e13f1abc98dfcfa6',
    '0xa0efb63be0db8fc11681a598bf351a42a6ff50e0',
    '0x8b83b9c4683aa4ec897c569010f09c6d04608163',
    '0x5b5b69f4e0add2df5d2176d7dbd20b4897bc7ec4',
    '0x4756eeebf378046f8dd3cb6fa908d93bfd45f139',
    '0x554f4476825293d4ad20e02b54aca13956acc40a',
    '0x7da82c7ab4771ff031b66538d2fb9b0b047f6cf9',
    '0xa8dcc0373822b94d7f57326be24ca67bafcaad6b',
    '0xd8d98ee915a5a4f52c40d97fcd8ffadea1ee8604',
    '0x6262998ced04146fa42253a5c0af90ca02dfd2a3',
    '0xfd898a0f677e97a9031654fc79a27cb5e31da34a',
    '0xb8cda067fabedd1bb6c11c626862d7255a2414fe',
    '0x701c484bfb40ac628afa487b6082f084b14af0bd',
    '0x4b4a011c420b91260a272afd91e54accdafdfc1d',
    '0xc4cf565a5d25ee2803c9b8e91fc3d7c62e79fe69',
    '0xd05e6bf1a00b5b4c9df909309f19e29af792422b',
    '0x19d599012788b991ff542f31208bab21ea38403e',
    '0x9c2fc4fc75fa2d7eb5ba9147fa7430756654faa9',
    '0xb20411c403687d1036e05c8a7310a0f218429503',
    '0x9a1ed80ebc9936cee2d3db944ee6bd8d407e7f9f',
    '0xb9fa6e54025b4f0829d8e1b42e8b846914659632',
    '0xba18ded5e0d604a86428282964ae0bb249ceb9d0',
    '0xfe01a216234f79cfc3bea7513e457c6a9e50250d',
    '0x0c05ec4db907cfb91b2a1a29e7b86688b7568a6d',
    '0xe04cf52e9fafa3d9bf14c407afff94165ef835f7',
    '0x77afe94859163abf0b90725d69e904ea91446c7b',
    '0xca582d9655a50e6512045740deb0de3a7ee5281f',
    '0x0f00294c6e4c30d9ffc0557fec6c586e6f8c3935',
    '0xeb2b00042ce4522ce2d1aacee6f312d26c4eb9d6',
    '0x7ae92148e79d60a0749fd6de374c8e81dfddf792',
    '0x091933ee1088cdf5daace8baec0997a4e93f0dd6',
    '0x828103b231b39fffce028562412b3c04a4640e64',
    '0xd6216fc19db775df9774a6e33526131da7d19a2c',
    '0xd69b0089d9ca950640f5dc9931a41a5965f00303',
    '0x4baf012726cb5ec7dda57bc2770798a38100c44d',
    '0x8d95842b0bca501446683be598e12f1c616770c1',
    '0x35aeed3aa9657abf8b847038bb591b51e1e4c69f',
    '0xb93d8596ac840816bd366dc0561e8140afd0d1cb',
    '0x3262f13a39efaca789ae58390441c9ed76bc658a',
    '0xb5ab08d153218c1a6a5318b14eeb92df0fb168d6',
    '0xdb3c617cdd2fbf0bb4309c325f47678e37f096d9',
    '0x7ead3a4361bd26a20deb89c9470be368ee9cb6f1',
    '0xd5268a476aadd1a6729df5b3e5e8f2c1004139af',
]

type MapedLeaderboardRow = {
    name: string
    score: string
}

export class LeaderboardController {
    async handle(request: Request, response: Response) {
        const leaderboard = await redisClient.zrevrange(
            'players',
            0,
            1000,
            'WITHSCORES',
        )

        const mappedLeaderboard: MapedLeaderboardRow[] = []
        leaderboard.forEach((item, index) => {
            if (index % 2 === 0) {
                mappedLeaderboard.push({
                    name: item,
                    score: leaderboard[index + 1],
                })
            }
        })

        // const leaderboardMapKeyValue: MapedLeaderboardRow[] = leaderboard
        //     .map((item, index) => {
        //         if (index % 2 === 0) {
        //             return {
        //                 name: item,
        //                 score: leaderboard[index + 1],
        //             }
        //         } else {
        //             return null
        //         }
        //     })
        //     .filter((notNull) => !!notNull)

        const rank = await redisClient.zrevrank('players', mockAddressList[33])

        return response.json({ rank, mappedLeaderboard, leaderboard })
    }

    async populate(requqest: Request, response: Response) {
        const addAddressToLeaderboard = async (
            address: string,
            score: number,
        ) => {
            return await redisClient.zadd('players', score, address)
        }

        mockAddressList.forEach(
            async (item) =>
                await addAddressToLeaderboard(
                    item,
                    Math.floor(Math.random() * 100000) + 1,
                ),
        )

        return response.json({ success: true })
    }
}
