export function syncUserLevel(user: any) {
    if (user.points >= 7) {
      user.role = 'expert';
      user.userType = 'administrateur';
    } else if (user.points >= 5) {
      user.role = 'avancé';
      user.userType = 'complexe';
    } else if (user.points >= 3) {
      user.role = 'intermédiaire';
      user.userType = 'simple';
    } else {
      user.role = 'débutant';
      user.userType = 'simple';
    }
  }