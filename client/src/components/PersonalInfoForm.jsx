import { User } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    return (
        <div className="">
            <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
                <p className='text-sm text-gray-600'>Get Started with Personal Information</p>
                <div className="flex items-center gap-2">
                    <label className="relative inline-block cursor-pointer">
                        {data.image ? (
                            <img src={typeof data.image == 'string' ? data.image : URL.createObjectURL(data.image)} alt='userImage'
                                className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80' />
                        ) : (
                            <div className="inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700">
                                <User className='size-10 p-2.5 border rounded-full'
                                /> Upload User Image
                            </div>
                        )}
                        <input type='file' accept='image/jpeg, image/png, image/gif, image/webp, image/svg+xml' className='absolute inset-0 w-full h-full opacity-0 cursor-pointer' onChange={(e) => handleChange("image", e.target.files[0])} />
                    </label>
                    {typeof data.image === 'object' && (
                        <div className="flex flex-col gap-1 pl-4 ">
                            <p>Remove Background</p>
                            <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                <input type="checkbox"
                                    className='sr-only peer'
                                    onChange={() => setRemoveBackground(prev => !prev)}
                                    checked={removeBackground} />
                                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200">
                                </div>
                                <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'>
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            </h3>
        </div>
    )
}

export default PersonalInfoForm