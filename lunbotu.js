/**
 * 轮播图组件
 * 功能：自动播放、手动切换、指示器点击、鼠标悬停暂停
 */

let currentIndex = 0;
let timer = null;
const images = document.querySelectorAll('.carousel-img');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

/**
 * 显示指定索引的图片
 * @param {number} index - 图片索引
 */
function showImage(index) {
    images.forEach(img => img.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    images[index].classList.add('active');
    indicators[index].classList.add('active');
    currentIndex = index;
}

/**
 * 显示下一张图片
 */
function nextImage() {
    showImage((currentIndex + 1) % images.length);
}

/**
 * 显示上一张图片
 */
function prevImage() {
    showImage((currentIndex - 1 + images.length) % images.length);
}

/**
 * 开始自动播放
 */
function startAutoPlay() {
    timer = setInterval(nextImage, 3000);
}

/**
 * 停止自动播放
 */
function stopAutoPlay() {
    clearInterval(timer);
}

/**
 * 初始化轮播图
 */
function initCarousel() {
    // 初始化显示第一张图片
    showImage(0);
    
    // 开始自动播放
    startAutoPlay();
    
    // 点击指示器切换图片
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', (e) => {
            e.stopPropagation();
            stopAutoPlay();
            showImage(i);
            startAutoPlay();
        });
    });
    
    // 点击上一张按钮
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopAutoPlay();
            prevImage();
            startAutoPlay();
        });
    }
    
    // 点击下一张按钮
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stopAutoPlay();
            nextImage();
            startAutoPlay();
        });
    }
    
    // 鼠标悬停暂停播放
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initCarousel);