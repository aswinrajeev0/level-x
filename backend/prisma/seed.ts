// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create Role Definitions
    const adminRole = await prisma.roleDefinition.create({ data: { name: 'ADMIN' } })
    const sellerRole = await prisma.roleDefinition.create({ data: { name: 'SELLER' } })
    const customerRole = await prisma.roleDefinition.create({ data: { name: 'CUSTOMER' } })

    // 2. Password hash
    const passwordHash = await bcrypt.hash('password123', 10)

    // 3. Create Users
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: passwordHash,
            role: 'ADMIN',
            isApproved: true,
            roles: { create: [{ roleId: adminRole.id }] }
        }
    })

    const seller = await prisma.user.create({
        data: {
            email: 'seller@example.com',
            name: 'Seller User',
            password: passwordHash,
            role: 'SELLER',
            isApproved: true,
            roles: { create: [{ roleId: sellerRole.id }] },
            sellerProfile: {
                create: {
                    shopName: 'Tech Store',
                    documentUrl: 'http://example.com/docs/seller.pdf',
                    approved: true
                }
            }
        },
        include: { sellerProfile: true }
    })

    const customer = await prisma.user.create({
        data: {
            email: 'customer@example.com',
            name: 'Customer User',
            password: passwordHash,
            role: 'CUSTOMER',
            isApproved: true,
            roles: { create: [{ roleId: customerRole.id }] },
            customerProfile: {
                create: {
                    address: '123 Main Street',
                    pincode: '560001'
                }
            }
        }
    })

    // 4. Categories
    const electronics = await prisma.category.create({ data: { name: 'Electronics' } })
    const fashion = await prisma.category.create({ data: { name: 'Fashion' } })

    // 5. Products
    const phone = await prisma.product.create({
        data: {
            name: 'Smartphone',
            description: 'Latest smartphone with 128GB storage',
            imageUrl:
                'https://media.gettyimages.com/id/1299655280/photo/apps-installed-on-a-samsung-galaxy-s21-smart-phone.jpg?s=612x612&w=gi&k=20&c=lhaG0yW0xaeexcoXhPyRacQdORcdjCEqv14ONGwluCg=',
            categoryId: electronics.id,
            approved: true,
            sellers: {
                create: {
                    sellerId: seller.sellerProfile!.id,
                    price: 699.99,
                    stock: 50
                }
            }
        }
    })

    const tshirt = await prisma.product.create({
        data: {
            name: 'T-Shirt',
            description: 'Cotton T-shirt',
            imageUrl: 'https://www.teez.in/cdn/shop/products/Link-Data-T-Shirt-3_large.jpg?v=1583558866',
            categoryId: fashion.id,
            approved: true,
            sellers: {
                create: {
                    sellerId: seller.sellerProfile!.id,
                    price: 19.99,
                    stock: 200
                }
            }
        }
    })

    // 6. Wishlist & Cart (⚡ updated with sellerId)
    await prisma.wishlist.create({
        data: { userId: customer.id, productId: phone.id }
    })
    await prisma.cart.create({
        data: {
            userId: customer.id,
            productId: tshirt.id,
            sellerId: seller.sellerProfile!.id,
            quantity: 2
        }
    })

    // 7. Orders
    const order = await prisma.order.create({
        data: {
            userId: customer.id,
            total: 739.97,
            status: 'CONFIRMED',
            items: {
                create: [
                    {
                        productId: phone.id,
                        sellerId: seller.sellerProfile!.id,
                        quantity: 1,
                        price: 699.99
                    },
                    {
                        productId: tshirt.id,
                        sellerId: seller.sellerProfile!.id,
                        quantity: 2,
                        price: 19.99
                    }
                ]
            },
            payment: {
                create: {
                    provider: 'Razorpay',
                    amount: 739.97,
                    status: 'SUCCESS'
                }
            }
        }
    })

    console.log('✅ Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
