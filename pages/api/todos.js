import {minifyRecord, todoTable} from "../../utils/Airtable";
import {NextApiRequest, NextApiResponse} from 'next'
import nc from 'next-connect'
import {getSession, useUser, withApiAuthRequired} from "@auth0/nextjs-auth0";

const ownsRecord = (handler) => async (req, res) => {
    const {user} = getSession(req, res)
    const {id} = req.body

    try {
        const existingRecord = await todoTable.find(id)

        if (!existingRecord || user.sub !== existingRecord.fields.userId) {
            res.statusCode = 400
            return res.json({msg: 'Record not found'})
        }

        req.record = existingRecord
        return handler(req, res)
    } catch (err) {
        console.error(err)
        res.statusCode = 500
        return res.json({msg: 'Something went wrong'})
    }

}

export default withApiAuthRequired(
    nc()
        .get(
            /**
             * @param {NextApiRequest} req
             * @param {NextApiResponse} res
             */
            async (req, res) => {
                try {
                    const session = getSession(req, res)
                    const records = await todoTable.select({
                        filterByFormula: `userId = '${session.user.sub}'`
                    }).firstPage()
                    res.statusCode = 200
                    res.json(records.map(minifyRecord))
                } catch (err) {
                    console.error(err)
                    res.statusCode = 500
                    res.json({msg: 'Something went wrong'})
                }
            }
        )
        .post(
            /**
             * @param {NextApiRequest} req
             * @param {NextApiResponse} res
             */
            async (req, res) => {
                try {
                    const session = getSession(req, res)
                    const description = req.body
                    const records = await todoTable.create([{
                        fields: {
                            description,
                            userId: session.user.sub
                        }
                    }])
                    const createdRecord = {
                        id: records[0].id,
                        fields: records[0].fields
                    }
                    res.statusCode = 200
                    res.json(createdRecord)
                } catch (err) {
                    console.error(err)
                    res.statusCode = 500
                    res.json({msg: 'Something went wrong'})
                }
            })
        .put(
            /**
             * @param {NextApiRequest} req
             * @param {NextApiResponse} res
             */
            ownsRecord(async (req, res) => {
                try {
                    const {id, fields} = req.body
                    const records = await todoTable.update([{id, fields}])
                    const updatedRecord = {
                        id: records[0].id,
                        fields: records[0].fields
                    }
                    res.statusCode = 200
                    res.json(updatedRecord)
                } catch (err) {
                    console.error(err)
                    res.statusCode = 500
                    res.json({msg: 'Something went wrong'})
                }
            })
        )
        .delete(
            /**
             * @param {NextApiRequest} req
             * @param {NextApiResponse} res
             */
            ownsRecord(async (req, res) => {
                try {
                    const {id} = req.body
                    const records = await todoTable.destroy([id])
                    const updatedRecord = {
                        id: records[0].id,
                        fields: records[0].fields
                    }
                    res.statusCode = 200
                    res.json(updatedRecord)
                } catch (err) {
                    console.error(err)
                    res.statusCode = 500
                    res.json({msg: 'Something went wrong'})
                }
            })
        )
)
