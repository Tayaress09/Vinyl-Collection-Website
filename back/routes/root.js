'use strict'

import '../database.js'
import {Vinyl, Track} from "../database.js";

export default async function (fastify, opts) {
    fastify.get('/vinyls', async function (request, reply) {
        reply.send(await Vinyl.findAll())
    })
    fastify.get('/vinyl/:id', async function (request, reply) {
        reply.send(await Vinyl.findByPk(request.params.id));
    })
    fastify.post('/vinyl/add', async function (request, reply) {
        if (!request.body?.name && !request.body?.artist && !request.body?.label && !request.body?.quantity && !request.body?.image) {
            reply.status(400).send('Le nom est obligatoire')
        } else {
            let releaseDate = request.body.month_release_date + "/" + request.body.year_release_date === "/" ? null : request.body.month_release_date + "/" + request.body.year_release_date
            let purchaseDate = request.body.month_purchase_date + "/" + request.body.year_purchase_date === "/" ? null : request.body.month_purchase_date + "/" + request.body.year_purchase_date
            let releasePrice = request.body.release_price === 0 ? null : request.body.release_price
            let currentPrice = request.body.current_price === 0 ? null : request.body.current_price
            let purchasePrice = request.body.purchase_price === 0 ? null : request.body.purchase_price

            reply.send(await Vinyl.create({
                name: request.body.name,
                release_date: releaseDate,
                purchase_date: purchaseDate,
                release_price: releasePrice,
                current_price: currentPrice,
                purchase_price: purchasePrice,
                quantity: request.body.quantity,
                artist: request.body.artist,
                image: request.body.image,
                label: request.body.label
            }))
        }
    })
    fastify.put('/vinyl/:id', async function ({params, body}, res) {
        const id = params.id;
        if (!body) {
            await Vinyl.update(body, {
                where: {
                    id
                }
            })
            res.send("Mis à jour")
        }
    });
    fastify.delete('/vinyl/:id', async function ({params, body}, res) {
        const id = params.id;
        await Vinyl.destroy({
            where: {
                id
            }
        })
        await Track.destroy({
            where: {
                vinyl_id: id
            }
        })
    });

    fastify.get('/tracks', async function (request, reply) {
        reply.send(await Track.findAll())
    })
    fastify.get('/track/:id', async function (request, reply) {
        reply.send(await Track.findByPk(request.params.id));
    })
    fastify.put('/track/:id', async function ({params, body}, res) {
        const id = params.id;
        if (!body) {
            await Track.update(body, {
                where: {
                    id
                }
            })
            res.send("Mis à jour")
        }
    });
    fastify.delete('/track/:id', async function ({params, body}, res) {
        const id = params.id;
        await Track.destroy({
            where: {
                id
            }
        })
    });

}