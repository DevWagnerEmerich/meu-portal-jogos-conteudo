import EventBus from '../core/EventBus.js';
import GamificationService from './GamificationService.js';

export const ACHIEVEMENTS_DATA = [
    { id: 'ach_aprendiz', name: 'Aprendiz', desc: 'Acumulou seus primeiros 1.000 XP!', icon: '📗', reqXP: 1000 },
    { id: 'ach_junior', name: 'Desenvolvedor Júnior', desc: 'Alcançou 2.500 XP de jornada!', icon: '💻', reqXP: 2500 },
    { id: 'ach_pleno', name: 'Desenvolvedor Pleno', desc: 'Bateu a marca de 5.000 XP!', icon: '⚙️', reqXP: 5000 },
    { id: 'ach_senior', name: 'Engenheiro Sênior', desc: 'Dominou 10.000 XP de Puro Código!', icon: '🧠', reqXP: 10000 },
    { id: 'ach_master', name: 'Mestre Algoritmo', desc: 'Consagrou-se com incríveis 15.000 XP!', icon: '👑', reqXP: 15000 }
];

class AchievementSystem {
    init() {
        EventBus.on('game:correct', () => {
            const state = GamificationService.getData();

            // Calculate total global XP across all languages from local save
            const progMap = JSON.parse(localStorage.getItem('brincabytes_progresso_codechain')) || {};
            let totalXP = 0;
            for (const v of Object.values(progMap)) totalXP += (v.pts || 0);

            // Unlock XP-based rank achievements
            ACHIEVEMENTS_DATA.forEach(ach => {
                if (totalXP >= ach.reqXP && !state.achievements.includes(ach.id)) {
                    GamificationService.unlockAchievement(ach.id);
                }
            });
        });

        EventBus.on('gamification:updated', (data) => {
            // Can add more economy-based achievements later if needed
        });
    }
}

export default new AchievementSystem();
