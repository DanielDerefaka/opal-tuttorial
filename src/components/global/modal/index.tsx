
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'

type ModalProps = {
    trigger: React.ReactNode
    children: React.ReactNode
    title: string
    description: string
    className?: string
}

const Modal = ({trigger, children, title, description, className}: ModalProps) => {
  return (
    <Dialog> 
        <DialogTrigger asChild className={className}>
            {trigger}
        </DialogTrigger>
        <DialogContent> 
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
        </DialogContent>
    </Dialog>
  )
}

export default Modal
