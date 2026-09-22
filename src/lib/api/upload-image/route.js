import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const image = formData.get("image");

        if (!image) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No image provided",
                },
                { status: 400 }
            );
        }

        if (!process.env.IMGBB_API_KEY) {
            console.error("IMGBB_API_KEY is missing");

            return NextResponse.json(
                {
                    success: false,
                    message: "ImgBB API key is not configured",
                },
                { status: 500 }
            );
        }

        const imgbbFormData = new FormData();

        imgbbFormData.append("image", image);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            {
                method: "POST",
                body: imgbbFormData,
            }
        );

        const result = await response.json();

        console.log("ImgBB response:", result);

        if (!response.ok || !result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        result?.error?.message ||
                        "ImgBB image upload failed",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: result.data.url,
            displayUrl: result.data.display_url,
            deleteUrl: result.data.delete_url,
        });

    } catch (error) {
        console.error("IMAGE UPLOAD ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to upload image",
            },
            { status: 500 }
        );
    }
}