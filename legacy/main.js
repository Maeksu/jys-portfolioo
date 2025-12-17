document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch('https://snowy-tree-1c2d.ysking1818.workers.dev/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formStatus.classList.remove('hidden');
                    formStatus.innerHTML = '<p class="text-green-600">메시지가 성공적으로 전송되었습니다!</p>';
                    contactForm.reset();
                } else {
                    throw new Error('서버 응답 오류');
                }
            } catch (error) {
                formStatus.classList.remove('hidden');
                formStatus.innerHTML = '<p class="text-red-600">메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.</p>';
            }

            // 3초 후 상태 메시지 숨기기
            setTimeout(() => {
                formStatus.classList.add('hidden');
            }, 3000);
        });
    }
});